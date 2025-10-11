import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, Check } from 'lucide-react';
import { Button, Card, Input, Progress } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * IP Registration Page - Multi-step form for registering intellectual property
 */
export const IPRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    creatorDetails: {
      isDeceased: null as boolean | null,
      creatorName: '',
      deathYear: '',
      estateRep: '',
    },
    workMetadata: {
      title: '',
      year: '',
      genre: '',
      description: '',
      tags: [] as string[],
    },
    licensing: {
      type: '',
      royaltyRate: 5,
      allowAITraining: false,
    },
  });

  const steps = [
    'Upload Content',
    'Creator Details', 
    'Work Metadata',
    'Licensing Terms',
    'Review & Submit'
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
              {currentStep === 1 && <CreatorDetailsStep formData={formData} setFormData={setFormData} />}
              {currentStep === 2 && <WorkMetadataStep formData={formData} setFormData={setFormData} />}
              {currentStep === 3 && <LicensingStep formData={formData} setFormData={setFormData} />}
              {currentStep === 4 && <ReviewStep formData={formData} />}
            </motion.div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-32">
              <PreviewCard formData={formData} currentStep={currentStep} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-stone-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
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
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
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
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadedFile] = React.useState<File | null>(null);

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold text-stone-900 mb-6">
        Upload Your Creative Work
      </h2>
      
      <div
        className={cn(
          'border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center transition-all duration-300',
          dragActive && 'border-accent-gold bg-accent-cream',
          uploadedFile && 'border-semantic-success bg-green-50'
        )}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDrop={() => {
          setDragActive(false);
          // Handle file drop
        }}
      >
        {uploadedFile ? (
          <div className="space-y-4">
            <Check className="h-12 w-12 text-semantic-success mx-auto" />
            <div>
              <p className="text-lg font-medium text-stone-900">File uploaded successfully!</p>
              <p className="text-sm text-stone-600">{uploadedFile.name}</p>
            </div>
            <Button variant="secondary" size="sm">
              Change File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-16 w-16 text-stone-400 mx-auto" />
            <div>
              <p className="text-lg text-stone-600 mb-2">
                Drag files here or click to browse
              </p>
              <p className="text-sm text-stone-500">
                Supports: PDF, DOCX, EPUB, TXT, JPG, PNG, MP3, MP4
              </p>
            </div>
            <Button variant="secondary">
              Browse Files
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * Creator Details Step
 */
const CreatorDetailsStep: React.FC<{ formData: any; setFormData: any }> = ({ 
  formData, 
  setFormData 
}) => {
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
                onClick={() => 
                  setFormData({
                    ...formData,
                    creatorDetails: { 
                      ...formData.creatorDetails, 
                      isDeceased: option.value 
                    }
                  })
                }
                className={cn(
                  'p-6 border-2 border-stone-300 rounded-xl cursor-pointer transition-all duration-300 text-left',
                  formData.creatorDetails.isDeceased === option.value && 'border-accent-gold bg-accent-cream shadow-md'
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
          value={formData.creatorDetails.creatorName}
          onChange={(e) => 
            setFormData({
              ...formData,
              creatorDetails: { 
                ...formData.creatorDetails, 
                creatorName: e.target.value 
              }
            })
          }
        />

        {formData.creatorDetails.isDeceased && (
          <>
            <Input
              label="Year of Death"
              type="number"
              placeholder="e.g., 1912"
              value={formData.creatorDetails.deathYear}
              onChange={(e) => 
                setFormData({
                  ...formData,
                  creatorDetails: { 
                    ...formData.creatorDetails, 
                    deathYear: e.target.value 
                  }
                })
              }
            />
            <Input
              label="Estate Representative"
              placeholder="Your name or organization"
              value={formData.creatorDetails.estateRep}
              onChange={(e) => 
                setFormData({
                  ...formData,
                  creatorDetails: { 
                    ...formData.creatorDetails, 
                    estateRep: e.target.value 
                  }
                })
              }
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
const WorkMetadataStep: React.FC<{ formData: any; setFormData: any }> = ({ 
  formData, 
  setFormData 
}) => {
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold text-stone-900 mb-6">
        Work Details
      </h2>

      <div className="space-y-6">
        <Input
          label="Title"
          placeholder="e.g., Dracula"
          value={formData.workMetadata.title}
          onChange={(e) => 
            setFormData({
              ...formData,
              workMetadata: { 
                ...formData.workMetadata, 
                title: e.target.value 
              }
            })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Publication Year"
            type="number"
            placeholder="e.g., 1897"
            value={formData.workMetadata.year}
            onChange={(e) => 
              setFormData({
                ...formData,
                workMetadata: { 
                  ...formData.workMetadata, 
                  year: e.target.value 
                }
              })
            }
          />
          <Input
            label="Genre"
            placeholder="e.g., Gothic Horror"
            value={formData.workMetadata.genre}
            onChange={(e) => 
              setFormData({
                ...formData,
                workMetadata: { 
                  ...formData.workMetadata, 
                  genre: e.target.value 
                }
              })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700 mb-2 block">
            Description
          </label>
          <textarea
            className="w-full min-h-32 rounded-lg border border-stone-300 bg-white px-4 py-3 text-base transition-all duration-200 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:border-accent-gold resize-y"
            placeholder="Describe your work..."
            value={formData.workMetadata.description}
            onChange={(e) => 
              setFormData({
                ...formData,
                workMetadata: { 
                  ...formData.workMetadata, 
                  description: e.target.value 
                }
              })
            }
          />
        </div>
      </div>
    </Card>
  );
};

/**
 * Licensing Step
 */
const LicensingStep: React.FC<{ formData: any; setFormData: any }> = ({ 
  formData, 
  setFormData 
}) => {
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
                onClick={() => 
                  setFormData({
                    ...formData,
                    licensing: { 
                      ...formData.licensing, 
                      type: license.id 
                    }
                  })
                }
                className={cn(
                  'p-6 border-2 border-stone-300 rounded-2xl cursor-pointer transition-all duration-300 text-left hover:-translate-y-1',
                  formData.licensing.type === license.id && 'border-accent-gold bg-accent-cream shadow-lg'
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

        {formData.licensing.type === 'commercial' && (
          <div>
            <label className="text-sm font-medium text-stone-700 mb-4 block">
              Royalty Rate: {formData.licensing.royaltyRate}%
            </label>
            <input
              type="range"
              min="1"
              max="25"
              value={formData.licensing.royaltyRate}
              onChange={(e) => 
                setFormData({
                  ...formData,
                  licensing: { 
                    ...formData.licensing, 
                    royaltyRate: parseInt(e.target.value) 
                  }
                })
              }
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
const PreviewCard: React.FC<{ formData: any; currentStep: number }> = ({ 
  formData
}) => {
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
            {formData.workMetadata.title || 'Untitled Work'}
          </h4>
          <p className="text-base text-stone-600">
            by {formData.creatorDetails.creatorName || 'Unknown Creator'}
          </p>
          {formData.creatorDetails.isDeceased && (
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-ghost/10 text-ghost rounded-full text-sm">
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