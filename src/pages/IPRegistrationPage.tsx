import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, Check, AlertCircle } from 'lucide-react';
import { Button, Card, Input, Progress } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useRegistrationStore } from '@/store/useRegistrationStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useAccount } from 'wagmi';
import { useRegistration } from '@/hooks/useRegistration';
import toast from 'react-hot-toast';
import FileUploadZone from '@/components/FileUploadZone';

/**
 * IP Registration Page - Multi-step form for registering intellectual property
 */
export const IPRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Blockchain registration hook
  const { handleCompleteRegistration, isPending, isPlagiarized } = useRegistration();
  
  // Registration store
  const {
    currentStep,
    nextStep: storeNextStep,
    prevStep: storePrevStep,
    formData,
    updateFormData,
    validateCurrentStep,
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

  const handleNextStep = async () => {
    // Validate current step
    if (!validateCurrentStep()) {
      toast.error('Please complete all required fields');
      return;
    }

    // If this is the last step, submit to blockchain
    if (currentStep === steps.length - 1) {
      setIsSubmitting(true);
      toast.loading('Submitting to Story Protocol blockchain...', { id: 'blockchain-submit' });
      
      const result = await handleCompleteRegistration();
      
      toast.dismiss('blockchain-submit');
      setIsSubmitting(false);

      if (result.success) {
        // Show success modal/page with transaction details
        toast.success('✨ Successfully registered on Story Protocol!', {
          duration: 6000,
        });
        
        // Navigate to success page or show modal
        setTimeout(() => {
          navigate(`/success?tx=${result.txHash}&id=${result.ipAssetId}`);
        }, 2000);
      } else {
        toast.error(`Registration failed: ${result.error || 'Unknown error'}`);
      }
    } else {
      // Just move to next step
      storeNextStep();
    }
  };

  const handlePrevStep = () => {
    storePrevStep();
  };

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Wallet Connection Warning */}
      {!isConnected && (
        <div className="bg-amber-50 border-b border-amber-200 px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span className="text-sm text-amber-900">
                Please connect your wallet to Story Protocol network to continue
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Plagiarism Warning */}
      {isPlagiarized && formData.ipfsHash && (
        <div className="bg-red-50 border-b border-red-200 px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm text-red-900">
              ⚠️ This content appears to be already registered on the blockchain
            </span>
          </div>
        </div>
      )}

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
            disabled={!isConnected || isSubmitting}
            iconRight={<ArrowRight className="h-4 w-4" />}
            loading={isSubmitting}
          >
            {currentStep === steps.length - 1 ? (isSubmitting ? 'Submitting to Blockchain...' : 'Submit to Story Protocol') : 'Next'}
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
  const { handleUploadComplete } = useRegistrationStore();

  const handleUpload = (data: any) => {
    handleUploadComplete(data);
    // Show success toast
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

      <FileUploadZone onUploadComplete={handleUpload} />
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

        <TagInput />
      </div>
    </Card>
  );
};

/**
 * Tag Input Component
 */
const TagInput: React.FC = () => {
  const { formData, addTag, removeTag, errors } = useRegistrationStore();
  const [inputValue, setInputValue] = React.useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    removeTag(tagToRemove);
  };

  return (
    <div>
      <label className="text-sm font-medium text-stone-700 mb-2 block">
        Tags <span className="text-red-500">*</span>
      </label>
      <div className="space-y-3">
        {/* Current Tags */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Tag Input */}
        <input
          type="text"
          placeholder="Type a tag and press Enter (e.g. horror, classic, literature)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddTag}
          className={cn(
            "w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-base transition-all duration-200",
            "placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:border-accent-gold",
            errors.tags && "border-red-300 bg-red-50"
          )}
        />
        
        <p className="text-xs text-stone-500">
          Press Enter to add tags. Min 3 chars, max 20 chars, up to 10 tags.
        </p>
        
        {errors.tags && (
          <p className="text-red-600 text-sm">{errors.tags}</p>
        )}
      </div>
    </div>
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
 * Estate Contract Step (only for deceased creators)
 */
const EstateContractStep: React.FC = () => {
  const { formData, addBeneficiary, removeBeneficiary, updateBeneficiary, calculateTotalPercentage } = useRegistrationStore();

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-stone-900 mb-2">
          Estate Contract Setup
        </h2>
        <p className="text-stone-600">
          Configure beneficiaries and their revenue shares from this IP.
        </p>
      </div>

      {!formData.isDeceased ? (
        <div className="text-center py-12">
          <p className="text-stone-500">This step is only required for deceased creators.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-stone-900">Beneficiaries</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={addBeneficiary}
            >
              Add Beneficiary
            </Button>
          </div>

          {formData.beneficiaries.length === 0 ? (
            <div className="text-center py-8 bg-stone-50 rounded-lg">
              <p className="text-stone-500">No beneficiaries added yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.beneficiaries.map((beneficiary, index) => (
                <div key={beneficiary.id} className="p-4 border border-stone-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Name"
                      placeholder="Beneficiary name"
                      value={beneficiary.name}
                      onChange={(e) => updateBeneficiary(beneficiary.id, { name: e.target.value })}
                    />
                    <Input
                      label="Wallet Address"
                      placeholder="0x..."
                      value={beneficiary.walletAddress}
                      onChange={(e) => updateBeneficiary(beneficiary.id, { walletAddress: e.target.value })}
                    />
                    <div className="flex items-end gap-2">
                      <Input
                        label="Percentage"
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={beneficiary.percentage.toString()}
                        onChange={(e) => updateBeneficiary(beneficiary.id, { percentage: parseInt(e.target.value) || 0 })}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBeneficiary(beneficiary.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-4 bg-stone-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-stone-700">Total Percentage:</span>
                  <span className={cn(
                    "font-semibold",
                    calculateTotalPercentage() > 100 ? "text-red-600" : "text-green-600"
                  )}>
                    {calculateTotalPercentage()}%
                  </span>
                </div>
                {calculateTotalPercentage() > 100 && (
                  <p className="text-red-600 text-sm mt-1">
                    Total percentage cannot exceed 100%
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
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