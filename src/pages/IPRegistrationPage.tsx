import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, Check, AlertCircle } from 'lucide-react';
import { Button, Card, Input, Progress } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useRegistrationStore } from '@/store/useRegistrationStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

/**
 * IP Registration Page - Multi-step form for registering intellectual property
 */
export const IPRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const { openWalletModal } = useWalletStore();
  
  // Registration store
  const {
    currentStep,
    setStep,
    nextStep: storeNextStep,
    prevStep: storePrevStep,
    formData,
    updateFormData,
    errors,
    validateCurrentStep,
    canProceed,
    isUploading,
    isAnalyzing,
  } = useRegistrationStore();

  const steps = [
    'Upload Content',
    'Creator Details', 
    'Work Metadata',
    'Estate Contract',
    'Licensing Terms'
  ];

  // Check wallet connection on mount
  useEffect(() => {
    if (!isConnected) {
      toast.error('Please connect your wallet to continue');
    } else if (address) {
      updateFormData('connectedWallet', address);
    }
  }, [isConnected, address, updateFormData]);

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      storeNextStep();
    } else {
      toast.error('Please complete all required fields');
    }
  };

  const handlePrevStep = () => {
    storePrevStep();
  };

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
              <span className="text-sm text-stone-600">Home &gt; Resurrect an IP</span>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-stone-900 mb-2">
              Bring Your IP Into Immortality
            </h1>
            <p className="text-lg text-stone-600">
              5-step process, approximately 5 minutes
            </p>
          </div>

          <Progress 
            currentStep={currentStep} 
            totalSteps={steps.length} 
            steps={steps}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Panel - Form */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && <UploadStep />}
              {currentStep === 1 && <CreatorDetailsStep />}
              {currentStep === 2 && <WorkMetadataStep />}
              {currentStep === 3 && <EstateContractStep />}
              {currentStep === 4 && <LicensingStep />}
            </motion.div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-32">
              <PreviewCard />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-stone-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>

          <span className="text-sm text-stone-600">
            Step {currentStep + 1} of {steps.length}
          </span>

          <Button
            variant="primary"
            onClick={handleNextStep}
            disabled={!isConnected}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            {currentStep === steps.length - 1 ? 'Submit Registration' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * Upload Step Component
 */
const UploadStep: React.FC = () => {
  const { 
    formData, 
    updateFormData, 
    setUploadState, 
    setAnalyzing, 
    setFileAnalysis,
    isUploading,
    isAnalyzing,
    errors 
  } = useRegistrationStore();
  
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) { // 100MB
      toast.error('File size must be less than 100MB');
      return;
    }

    const allowedTypes = [
      'application/pdf', 'application/msword', 'text/plain',
      'audio/mpeg', 'audio/wav', 'video/mp4', 'video/quicktime',
      'image/jpeg', 'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file type');
      return;
    }

    updateFormData('uploadedFile', file);
    
    // Simulate upload progress
    setUploadState(true, 0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadState(true, i);
    }
    setUploadState(false);

    // Simulate AI analysis
    setAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis result
    const mockAnalysis = {
      title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
      publicationYear: 2020,
      genre: file.type.includes('image') ? 'Visual Art' : 
             file.type.includes('audio') ? 'Music' : 
             file.type.includes('video') ? 'Film' : 'Literature',
      description: `A creative work titled "${file.name}". This appears to be a ${file.type.includes('image') ? 'visual artwork' : file.type.includes('audio') ? 'musical composition' : file.type.includes('video') ? 'video production' : 'written work'} with potential commercial and artistic value.`,
      detectedInfluences: [
        { ipAssetId: '0x123', name: 'Classic Literature Style', year: 1950, confidence: 0.8, include: true },
        { ipAssetId: '0x456', name: 'Modern Narrative Techniques', year: 1990, confidence: 0.6, include: false }
      ]
    };
    
    setFileAnalysis(mockAnalysis);
    updateFormData('ipfsHash', `ipfs://Qm${Math.random().toString(36).substr(2, 44)}`);
    setAnalyzing(false);
    
    toast.success('File uploaded and analyzed successfully!');
  };

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-stone-900 mb-2">
          Upload Your Creative Work
        </h2>
        <p className="text-stone-600">
          Upload the digital file of the intellectual property you wish to register.
        </p>
      </div>

      {!formData.uploadedFile ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
            dragActive ? "border-blue-400 bg-blue-50" : "border-stone-300 hover:border-stone-400",
            errors.uploadedFile && "border-red-300 bg-red-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="h-16 w-16 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-stone-600 text-sm mb-4">
            Supported formats: PDF, DOC, TXT, MP3, WAV, MP4, MOV, JPG, PNG
          </p>
          <p className="text-stone-500 text-xs">
            Maximum file size: 100MB
          </p>
          
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.mp3,.wav,.mp4,.mov,.jpg,.jpeg,.png"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Upload Success */}
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-green-900">
                  {formData.uploadedFile.name}
                </span>
                <p className="text-xs text-green-700">
                  {(formData.uploadedFile.size / 1024 / 1024).toFixed(2)} MB • IPFS: {formData.ipfsHash.slice(0, 20)}...
                </p>
              </div>
            </div>
          </div>

          {/* Analysis Status */}
          {isAnalyzing ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-blue-900">
                  Analyzing content with AI...
                </span>
              </div>
            </div>
          ) : formData.fileAnalysis ? (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <h4 className="font-medium text-stone-900 mb-2">AI Analysis Complete</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Detected Title:</strong> {formData.fileAnalysis.title}</p>
                <p><strong>Genre:</strong> {formData.fileAnalysis.genre}</p>
                <p><strong>Influences Found:</strong> {formData.fileAnalysis.detectedInfluences.length} potential matches</p>
              </div>
            </div>
          ) : null}

          {/* Upload Progress */}
          {isUploading && (
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${formData.uploadedFile ? 100 : 0}%` }}
              />
            </div>
          )}
        </div>
      )}

      {errors.uploadedFile && (
        <p className="text-red-600 text-sm mt-2">{errors.uploadedFile}</p>
      )}
    </Card>
  );
};

/**
 * Creator Details Step
 */
const CreatorDetailsStep: React.FC = () => {
  const { formData, updateFormData, errors } = useRegistrationStore();
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold text-stone-900 mb-6">
        Creator Information
      </h2>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-stone-700 mb-3 block">
            Is the creator deceased?
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: true, label: 'Yes (Ghost Wallet)', icon: '👻' },
              { value: false, label: 'No (Living Creator)', icon: '👤' }
            ].map((option) => (
              <button
                key={option.value.toString()}
                onClick={() => updateFormData('isDeceased', option.value)}
                className={cn(
                  'p-6 border-2 border-stone-300 rounded-xl cursor-pointer transition-all duration-300 text-left',
                  formData.isDeceased === option.value && 'border-accent-gold bg-accent-cream shadow-md'
                )}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="text-lg font-semibold text-stone-900">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Creator Name"
          placeholder="e.g., Bram Stoker"
          value={formData.creatorName}
          onChange={(e) => updateFormData('creatorName', e.target.value)}
        />

        {formData.isDeceased && (
          <>
            <Input
              label="Year of Death"
              type="number"
              placeholder="e.g., 1912"
              value={formData.deathYear?.toString() || ''}
              onChange={(e) => updateFormData('deathYear', parseInt(e.target.value) || null)}
            />
            <Input
              label="Estate Representative"
              placeholder="Your name or organization"
              value={formData.estateRepresentative}
              onChange={(e) => updateFormData('estateRepresentative', e.target.value)}
            />
          </>
        )}
      </div>
    </Card>
  );
};

/**
 * Work Metadata Step  
 */
const WorkMetadataStep: React.FC = () => {
  const { formData, updateFormData } = useRegistrationStore();
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold text-stone-900 mb-6">
        Work Details
      </h2>

      <div className="space-y-6">
        <Input
          label="Title"
          placeholder="e.g., Dracula"
          value={formData.fileAnalysis?.title || ''}
          onChange={(e) => {
            const updatedAnalysis = {
              ...formData.fileAnalysis,
              title: e.target.value,
              publicationYear: formData.fileAnalysis?.publicationYear || null,
              genre: formData.fileAnalysis?.genre || '',
              description: formData.fileAnalysis?.description || '',
              detectedInfluences: formData.fileAnalysis?.detectedInfluences || []
            };
            updateFormData('fileAnalysis', updatedAnalysis);
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Publication Year"
            type="number"
            placeholder="e.g., 1897"
            value={formData.fileAnalysis?.publicationYear?.toString() || ''}
            onChange={(e) => {
              const updatedAnalysis = {
                ...formData.fileAnalysis,
                title: formData.fileAnalysis?.title || '',
                publicationYear: parseInt(e.target.value) || null,
                genre: formData.fileAnalysis?.genre || '',
                description: formData.fileAnalysis?.description || '',
                detectedInfluences: formData.fileAnalysis?.detectedInfluences || []
              };
              updateFormData('fileAnalysis', updatedAnalysis);
            }}
          />
          <Input
            label="Genre"
            placeholder="e.g., Gothic Horror"
            value={formData.fileAnalysis?.genre || ''}
            onChange={(e) => {
              const updatedAnalysis = {
                ...formData.fileAnalysis,
                title: formData.fileAnalysis?.title || '',
                publicationYear: formData.fileAnalysis?.publicationYear || null,
                genre: e.target.value,
                description: formData.fileAnalysis?.description || '',
                detectedInfluences: formData.fileAnalysis?.detectedInfluences || []
              };
              updateFormData('fileAnalysis', updatedAnalysis);
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700 mb-2 block">
            Description
          </label>
          <textarea
            className="w-full min-h-32 rounded-lg border border-stone-300 bg-white px-4 py-3 text-base transition-all duration-200 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:border-accent-gold resize-y"
            placeholder="Describe your work..."
            value={formData.fileAnalysis?.description || ''}
            onChange={(e) => {
              const updatedAnalysis = {
                ...formData.fileAnalysis,
                title: formData.fileAnalysis?.title || '',
                publicationYear: formData.fileAnalysis?.publicationYear || null,
                genre: formData.fileAnalysis?.genre || '',
                description: e.target.value,
                detectedInfluences: formData.fileAnalysis?.detectedInfluences || []
              };
              updateFormData('fileAnalysis', updatedAnalysis);
            }}
          />
        </div>
      </div>
    </Card>
  );
};

/**
 * Licensing Step
 */
const LicensingStep: React.FC = () => {
  const { formData, updateFormData } = useRegistrationStore();
  const licenseTypes = [
    {
      id: 'open',
      title: 'Open License',
      description: 'Free for all uses with attribution',
      price: 'FREE'
    },
    {
      id: 'commercial',
      title: 'Commercial License', 
      description: 'Allows commercial use with royalties',
      price: '5-15% royalty'
    }
  ];

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold text-stone-900 mb-6">
        Licensing Terms
      </h2>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-stone-700 mb-4 block">
            License Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {licenseTypes.map((license) => (
              <button
                key={license.id}
                onClick={() => updateFormData('licenseType', license.id)}
                className={cn(
                  'p-6 border-2 border-stone-300 rounded-2xl cursor-pointer transition-all duration-300 text-left hover:-translate-y-1',
                  formData.licenseType === license.id && 'border-accent-gold bg-accent-cream shadow-lg'
                )}
              >
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  {license.title}
                </h3>
                <p className="text-sm text-stone-600 mb-4">
                  {license.description}
                </p>
                <div className="text-lg font-bold text-accent-gold">
                  {license.price}
                </div>
              </button>
            ))}
          </div>
        </div>

        {formData.licenseType === 'commercial' && (
          <div>
            <label className="text-sm font-medium text-stone-700 mb-4 block">
              Royalty Rate: {formData.royaltyRate}%
            </label>
            <input
              type="range"
              min="1"
              max="25"
              value={formData.royaltyRate}
              onChange={(e) => updateFormData('royaltyRate', parseInt(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-stone-500 mt-2">
              <span>1%</span>
              <span>25%</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * Review Step
 */
const ReviewStep: React.FC<{ formData: any }> = ({ formData }) => {
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold text-stone-900 mb-6">
        Review & Submit
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Creator Details</h3>
          <div className="bg-stone-50 rounded-lg p-4 space-y-2">
            <p><strong>Name:</strong> {formData.creatorDetails.creatorName || 'Not specified'}</p>
            <p><strong>Status:</strong> {formData.creatorDetails.isDeceased ? 'Deceased' : 'Living'}</p>
            {formData.creatorDetails.isDeceased && (
              <p><strong>Death Year:</strong> {formData.creatorDetails.deathYear || 'Not specified'}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Work Information</h3>
          <div className="bg-stone-50 rounded-lg p-4 space-y-2">
            <p><strong>Title:</strong> {formData.workMetadata.title || 'Not specified'}</p>
            <p><strong>Year:</strong> {formData.workMetadata.year || 'Not specified'}</p>
            <p><strong>Genre:</strong> {formData.workMetadata.genre || 'Not specified'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Licensing</h3>
          <div className="bg-stone-50 rounded-lg p-4 space-y-2">
            <p><strong>Type:</strong> {formData.licensing.type || 'Not selected'}</p>
            {formData.licensing.type === 'commercial' && (
              <p><strong>Royalty Rate:</strong> {formData.licensing.royaltyRate}%</p>
            )}
          </div>
        </div>

        <div className="border-t border-stone-200 pt-6">
          <Button variant="primary" size="lg" fullWidth>
            Register IP Asset & Create Ghost Wallet
          </Button>
        </div>
      </div>
    </Card>
  );
};

/**
 * Preview Card Component
 */
const PreviewCard: React.FC = () => {
  const { formData, currentStep } = useRegistrationStore();
  return (
    <Card className="p-8 shadow-xl">
      <h3 className="text-lg font-semibold text-stone-900 mb-6">Live Preview</h3>
      
      <div className="space-y-6">
        {/* Mock Preview */}
        <div className="aspect-video bg-stone-100 rounded-lg flex items-center justify-center">
          <span className="text-stone-500">Content Preview</span>
        </div>
        
        <div>
          <h4 className="text-xl font-bold text-stone-900">
            {formData.fileAnalysis?.title || 'Untitled Work'}
          </h4>
          <p className="text-base text-stone-600">
            by {formData.creatorName || 'Unknown Creator'}
          </p>
          {formData.isDeceased && (
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm">
              👻 Ghost Wallet
            </div>
          )}
        </div>

        <hr className="border-stone-200" />

        {/* Cost Breakdown */}
        <div>
          <h5 className="text-base font-semibold text-stone-900 mb-4">Registration Costs</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Story Protocol Fee</span>
              <span className="font-mono text-stone-900">10 STORY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Ghost Protocol Fee</span>
              <span className="font-mono text-stone-900">5 STORY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Gas Fee (est.)</span>
              <span className="font-mono text-stone-900">~0.002 ETH</span>
            </div>
            <hr className="border-stone-200" />
            <div className="flex justify-between font-semibold">
              <span className="text-stone-900">Total</span>
              <span className="font-mono text-stone-900">15 STORY + gas</span>
            </div>
          </div>
        </div>

        <hr className="border-stone-200" />

        {/* Features */}
        <div>
          <h5 className="text-sm font-medium text-stone-700 mb-3">Your IP will be:</h5>
          <div className="space-y-2 text-sm">
            {[
              'Protected on Story blockchain',
              'Earning royalties automatically', 
              'Monitored for plagiarism',
              'Visible in Influence Graph'
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-semantic-success mt-0.5 flex-shrink-0" />
                <span className="text-stone-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};