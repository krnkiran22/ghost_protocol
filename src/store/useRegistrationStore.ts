import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Beneficiary {
  id: string;
  walletAddress: string;
  name: string;
  percentage: number;
}

export interface DetectedInfluence {
  ipAssetId: string;
  name: string;
  year: number;
  confidence: number;
  include: boolean;
}

export interface TimeCapsuleRule {
  id: string;
  conditionType: 'year' | 'revenue' | 'event';
  conditionOperator: '>' | '<' | '=';
  conditionValue: any;
  actionType: 'transfer' | 'license_change' | 'donate';
  actionTarget: string;
  actionValue: any;
}

export interface FileAnalysis {
  title: string;
  publicationYear: number | null;
  genre: string;
  description: string;
  detectedInfluences: DetectedInfluence[];
}

export interface RegistrationFormData {
  // Step 1: Creator Details
  isDeceased: boolean | null;
  creatorName: string;
  deathYear: number | null;
  estateRepresentative: string;
  verificationDoc: File | null;
  connectedWallet: string;
  
  // Step 2: File Upload & Analysis
  uploadedFile: File | null;
  ipfsHash: string;
  ipfsUrl: string;
  fileAnalysis: FileAnalysis | null;
  tags: string[];
  
  // Step 3: Estate Contract (conditional)
  beneficiaries: Beneficiary[];
  
  // Step 4: Licensing
  licenseType: string;
  royaltyRate: number;
  allowAITraining: boolean;
  aiTrainingPrice: number;
  
  // Step 5: Time Capsule (optional)
  timeCapsuleEnabled: boolean;
  timeCapsuleRules: TimeCapsuleRule[];
}

export interface RegistrationState {
  // Form state
  currentStep: number;
  formData: RegistrationFormData;
  errors: Record<string, string>;
  
  // Upload state
  isUploading: boolean;
  uploadProgress: number;
  isAnalyzing: boolean;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: <K extends keyof RegistrationFormData>(
    key: K, 
    value: RegistrationFormData[K]
  ) => void;
  
  // Beneficiary management
  addBeneficiary: () => void;
  removeBeneficiary: (id: string) => void;
  updateBeneficiary: (id: string, data: Partial<Beneficiary>) => void;
  calculateTotalPercentage: () => number;
  
  // Time capsule management
  addTimeCapsuleRule: () => void;
  removeTimeCapsuleRule: (id: string) => void;
  updateTimeCapsuleRule: (id: string, data: Partial<TimeCapsuleRule>) => void;
  
  // Tag management
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  
  // File upload
  setUploadState: (uploading: boolean, progress?: number) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setFileAnalysis: (analysis: FileAnalysis) => void;
  handleUploadComplete: (data: { 
    title: string;
    publicationYear: number | null;
    genre: string;
    description: string;
    detectedInfluences: any[];
    ipfsHash: string;
    fileName: string;
    ipfsUrl: string;
  }) => void;
  
  // Error management
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  
  // Validation
  validateCurrentStep: () => boolean;
  canProceed: () => boolean;
  
  // Reset
  resetForm: () => void;
}

const initialFormData: RegistrationFormData = {
  // Step 1
  isDeceased: null,
  creatorName: '',
  deathYear: null,
  estateRepresentative: '',
  verificationDoc: null,
  connectedWallet: '',
  
  // Step 2
  uploadedFile: null,
  ipfsHash: '',
  ipfsUrl: '',
  fileAnalysis: null,
  tags: [],
  
  // Step 3
  beneficiaries: [],
  
  // Step 4
  licenseType: '',
  royaltyRate: 15, // Default 15%
  allowAITraining: false,
  aiTrainingPrice: 0.001, // Default price
  
  // Step 5
  timeCapsuleEnabled: false,
  timeCapsuleRules: [],
};

/**
 * Zustand store for IP registration form state
 */
export const useRegistrationStore = create<RegistrationState>((set, get) => ({
  // Initial state
  currentStep: 0,
  formData: initialFormData,
  errors: {},
  isUploading: false,
  uploadProgress: 0,
  isAnalyzing: false,

  // Step navigation
  setStep: (step: number) => {
    const maxStep = 4; // 0-indexed, so 5 steps total
    const clampedStep = Math.max(0, Math.min(step, maxStep));
    set({ currentStep: clampedStep });
  },

  nextStep: () => {
    const { currentStep, validateCurrentStep } = get();
    if (validateCurrentStep() && currentStep < 4) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  // Form data updates
  updateFormData: (key, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    }));
  },

  // File upload completion handler
  handleUploadComplete: (data: { 
    title: string;
    publicationYear: number | null;
    genre: string;
    description: string;
    detectedInfluences: any[];
    ipfsHash: string;
    fileName: string;
    ipfsUrl: string;
  }) => {
    set((state) => {
      // Ensure we have minimum required data
      const title = data.title || data.fileName.replace(/\.[^/.]+$/, '') || 'Untitled Work';
      const genre = data.genre || 'Creative Work';
      const description = data.description || `A creative work uploaded as ${data.fileName}`;
      
      // Create a mock File object to satisfy uploadedFile requirement
      const mockFile = {
        name: data.fileName,
        size: 0, // We don't have the size from analysis
        type: 'application/octet-stream'
      } as File;

      return {
        formData: {
          ...state.formData,
          uploadedFile: mockFile, // Set this so validation passes
          ipfsHash: data.ipfsHash,
          ipfsUrl: data.ipfsUrl,
          fileAnalysis: {
            title: title,
            publicationYear: data.publicationYear,
            genre: genre,
            description: description,
            detectedInfluences: data.detectedInfluences?.map(influence => ({
              ipAssetId: `influence-${Date.now()}-${Math.random()}`,
              name: influence.name || 'Unknown Work',
              year: influence.year || 0,
              confidence: influence.confidence || 0,
              include: (influence.confidence || 0) > 70
            })) || []
          },
          // Auto-generate comprehensive tags
          tags: [
            ...state.formData.tags,
            genre.toLowerCase(),
            data.fileName.split('.').pop()?.toLowerCase() || 'file',
            'ip-asset',
            'creative-work',
            'digital-asset'
          ].filter((tag, index, self) => 
            tag && tag.length > 0 && self.indexOf(tag) === index
          ) // Remove duplicates and empty tags
        }
      };
    });
  },

  // Beneficiary management
  addBeneficiary: () => {
    const newBeneficiary: Beneficiary = {
      id: uuidv4(),
      walletAddress: '',
      name: '',
      percentage: 0,
    };
    
    set((state) => ({
      formData: {
        ...state.formData,
        beneficiaries: [...state.formData.beneficiaries, newBeneficiary],
      },
    }));
  },

  removeBeneficiary: (id: string) => {
    set((state) => ({
      formData: {
        ...state.formData,
        beneficiaries: state.formData.beneficiaries.filter(b => b.id !== id),
      },
    }));
  },

  updateBeneficiary: (id: string, data: Partial<Beneficiary>) => {
    set((state) => ({
      formData: {
        ...state.formData,
        beneficiaries: state.formData.beneficiaries.map(b => 
          b.id === id ? { ...b, ...data } : b
        ),
      },
    }));
  },

  calculateTotalPercentage: () => {
    const { formData } = get();
    return formData.beneficiaries.reduce((total, b) => total + b.percentage, 0);
  },

  // Time capsule management
  addTimeCapsuleRule: () => {
    const newRule: TimeCapsuleRule = {
      id: uuidv4(),
      conditionType: 'year',
      conditionOperator: '>',
      conditionValue: new Date().getFullYear() + 50,
      actionType: 'transfer',
      actionTarget: '',
      actionValue: 100,
    };
    
    set((state) => ({
      formData: {
        ...state.formData,
        timeCapsuleRules: [...state.formData.timeCapsuleRules, newRule],
      },
    }));
  },

  removeTimeCapsuleRule: (id: string) => {
    set((state) => ({
      formData: {
        ...state.formData,
        timeCapsuleRules: state.formData.timeCapsuleRules.filter(r => r.id !== id),
      },
    }));
  },

  updateTimeCapsuleRule: (id: string, data: Partial<TimeCapsuleRule>) => {
    set((state) => ({
      formData: {
        ...state.formData,
        timeCapsuleRules: state.formData.timeCapsuleRules.map(r => 
          r.id === id ? { ...r, ...data } : r
        ),
      },
    }));
  },

  // Tag management
  addTag: (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && trimmed.length >= 3 && trimmed.length <= 20) {
      set((state) => {
        const currentTags = state.formData.tags;
        if (!currentTags.includes(trimmed) && currentTags.length < 10) {
          return {
            formData: {
              ...state.formData,
              tags: [...currentTags, trimmed],
            },
          };
        }
        return state;
      });
    }
  },

  removeTag: (tag: string) => {
    set((state) => ({
      formData: {
        ...state.formData,
        tags: state.formData.tags.filter(t => t !== tag),
      },
    }));
  },

  // File upload state
  setUploadState: (uploading: boolean, progress = 0) => {
    set({ isUploading: uploading, uploadProgress: progress });
  },

  setAnalyzing: (analyzing: boolean) => {
    set({ isAnalyzing: analyzing });
  },

  setFileAnalysis: (analysis: FileAnalysis) => {
    set((state) => ({
      formData: {
        ...state.formData,
        fileAnalysis: analysis,
      },
    }));
  },

  // Error management
  setError: (field: string, message: string) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [field]: message,
      },
    }));
  },

  clearError: (field: string) => {
    set((state) => {
      const newErrors = { ...state.errors };
      delete newErrors[field];
      return { errors: newErrors };
    });
  },

  clearAllErrors: () => {
    set({ errors: {} });
  },

  // Validation
  validateCurrentStep: () => {
    const { currentStep, formData, setError, clearAllErrors } = get();
    clearAllErrors();
    
    let isValid = true;
    
    switch (currentStep) {
      case 0: // File upload
        // Check if file is uploaded AND analysis is complete
        if (!formData.uploadedFile || !formData.ipfsHash) {
          setError('uploadedFile', 'Please upload a file and wait for processing to complete');
          isValid = false;
        }
        // Ensure basic analysis data exists
        if (!formData.fileAnalysis?.title || !formData.fileAnalysis?.genre) {
          setError('fileAnalysis', 'File analysis incomplete. Please try uploading again.');
          isValid = false;
        }
        break;
        
      case 1: // Creator details
        if (!formData.creatorName.trim()) {
          setError('creatorName', 'Creator name is required');
          isValid = false;
        }
        if (formData.isDeceased === null) {
          setError('isDeceased', 'Please specify if creator is deceased');
          isValid = false;
        }
        if (formData.isDeceased && !formData.deathYear) {
          setError('deathYear', 'Death year is required');
          isValid = false;
        }
        if (formData.isDeceased && !formData.estateRepresentative.trim()) {
          setError('estateRepresentative', 'Estate representative is required');
          isValid = false;
        }
        break;
        
      case 2: // Work metadata
        // Ensure all required fields are present
        if (!formData.fileAnalysis?.title?.trim()) {
          setError('title', 'Title is required');
          isValid = false;
        }
        if (!formData.fileAnalysis?.genre?.trim()) {
          setError('genre', 'Genre is required');
          isValid = false;
        }
        if (!formData.fileAnalysis?.description?.trim()) {
          setError('description', 'Description is required');
          isValid = false;
        }
        
        // Auto-fix tags if missing
        if (formData.tags.length === 0) {
          const { addTag } = get();
          if (formData.fileAnalysis?.genre) {
            addTag(formData.fileAnalysis.genre.toLowerCase());
          }
          addTag('creative-work');
          addTag('ip-asset');
        }
        
        // Ensure minimum tag requirement
        if (formData.tags.length < 2) {
          setError('tags', 'At least 2 tags are required');
          isValid = false;
        }
        break;
        
      case 3: // Estate contract (only if deceased)
        if (formData.isDeceased) {
          if (formData.beneficiaries.length === 0) {
            setError('beneficiaries', 'At least one beneficiary is required');
            isValid = false;
          }
          
          const totalPercentage = get().calculateTotalPercentage();
          if (totalPercentage > 100) {
            setError('totalPercentage', 'Total percentage cannot exceed 100%');
            isValid = false;
          }
          
          // Validate each beneficiary
          formData.beneficiaries.forEach((b, index) => {
            if (!b.walletAddress.trim()) {
              setError(`beneficiary_${index}_address`, 'Wallet address is required');
              isValid = false;
            }
            // TODO: Add Ethereum address validation
          });
        }
        break;
        
      case 4: // Licensing
        if (!formData.licenseType) {
          setError('licenseType', 'Please select a license type');
          isValid = false;
        }
        if (formData.allowAITraining && formData.aiTrainingPrice <= 0) {
          setError('aiTrainingPrice', 'AI training price must be greater than 0');
          isValid = false;
        }
        break;
    }
    
    return isValid;
  },

  canProceed: () => {
    const { currentStep } = get();
    return currentStep < 4; // Can proceed if not on last step
  },

  // Reset form
  resetForm: () => {
    set({
      currentStep: 0,
      formData: initialFormData,
      errors: {},
      isUploading: false,
      uploadProgress: 0,
      isAnalyzing: false,
    });
  },
}));