
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Camera, ArrowRight, X, Plus } from 'lucide-react';
import DevButton from '@/components/ui/dev-button';

const fieldOptions = [
  'Software Engineering',
  'Machine Learning',
  'Data Science',
  'Web Development',
  'Mobile Development',
  'DevOps',
  'Game Development',
  'UX/UI Design',
  'Cybersecurity',
  'Blockchain',
];

const skillOptions = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
  'React',
  'Angular',
  'Vue',
  'Node.js',
  'Django',
  'Flask',
  'Spring',
  'ASP.NET',
  'AWS',
  'Azure',
  'Google Cloud',
  'Docker',
  'Kubernetes',
  'Git',
  'CI/CD',
];

const SetupProfile: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);
  const [profession, setProfession] = useState(user?.profession || '');
  const [fieldOfStudy, setFieldOfStudy] = useState(user?.fieldOfStudy || '');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [experience, setExperience] = useState(user?.experience || '');
  const [searchField, setSearchField] = useState('');
  const [searchSkill, setSearchSkill] = useState('');
  const navigate = useNavigate();

  const filteredFields = fieldOptions.filter(field => 
    field.toLowerCase().includes(searchField.toLowerCase())
  );

  const filteredSkills = skillOptions.filter(skill => 
    skill.toLowerCase().includes(searchSkill.toLowerCase())
    && !skills.includes(skill)
  );

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, this would upload to a server/cloud storage
    // Here we're just creating a local URL for demo purposes
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleFinish = async () => {
    await updateProfile({
      profilePicture,
      profession,
      fieldOfStudy,
      skills,
      experience,
    });
    navigate('/');
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addSkill = (skillToAdd: string) => {
    if (!skills.includes(skillToAdd)) {
      setSkills([...skills, skillToAdd]);
    }
    setSearchSkill('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-devpulse-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-devpulse-secondary bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tell us more about yourself and your expertise
          </p>
        </div>
        
        <div className="dev-card p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-16 rounded-full ${
                    s === step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Step {step} of 3
            </span>
          </div>
          
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6">Basic Info</h2>
              
              <div className="mb-6 flex flex-col items-center">
                <div className="relative group w-32 h-32 rounded-full overflow-hidden mb-4 bg-muted">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-primary/10 text-primary">
                      {user?.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera size={32} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Add a profile picture
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="profession" className="block text-sm font-medium mb-1">
                  Profession
                </label>
                <input
                  id="profession"
                  type="text"
                  className="dev-input w-full"
                  placeholder="e.g. Software Developer, Data Scientist"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="experience" className="block text-sm font-medium mb-1">
                  Years of Experience
                </label>
                <select
                  id="experience"
                  className="dev-input w-full"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option value="">Select experience</option>
                  <option value="< 1 year">Less than 1 year</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
              
              <DevButton
                onClick={handleNext}
                className="w-full"
                rightIcon={<ArrowRight size={16} />}
                disabled={!profession || !experience}
              >
                Continue
              </DevButton>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Field of Study</h2>
              
              <div className="mb-6">
                <label htmlFor="fieldSearch" className="block text-sm font-medium mb-1">
                  Search or select your field
                </label>
                <input
                  id="fieldSearch"
                  type="text"
                  className="dev-input w-full mb-2"
                  placeholder="Search..."
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                />
                
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {filteredFields.map((field) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => setFieldOfStudy(field)}
                      className={`p-2 text-sm rounded-md transition-colors ${
                        fieldOfStudy === field
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
                
                {fieldOfStudy && !fieldOptions.includes(fieldOfStudy) && (
                  <div className="mt-3">
                    <p className="text-sm">Custom field:</p>
                    <div className="flex items-center mt-1 bg-primary/10 text-primary rounded-md px-3 py-2">
                      {fieldOfStudy}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <DevButton
                  onClick={handlePrevious}
                  variant="outline"
                >
                  Back
                </DevButton>
                <DevButton
                  onClick={handleNext}
                  rightIcon={<ArrowRight size={16} />}
                  disabled={!fieldOfStudy}
                >
                  Continue
                </DevButton>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Skills</h2>
              
              <div className="mb-6">
                <label htmlFor="skillSearch" className="block text-sm font-medium mb-1">
                  Add your technical skills
                </label>
                <div className="relative">
                  <input
                    id="skillSearch"
                    type="text"
                    className="dev-input w-full pr-10"
                    placeholder="Search skills..."
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                  />
                  {searchSkill && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => addSkill(searchSkill)}
                    >
                      <Plus size={16} className="text-primary" />
                    </button>
                  )}
                </div>
                
                {searchSkill && (
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {filteredSkills.length > 0 ? (
                      filteredSkills.slice(0, 5).map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full text-left p-2 hover:bg-muted rounded-md flex items-center justify-between"
                        >
                          <span>{skill}</span>
                          <Plus size={16} className="text-primary" />
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground p-2">
                        No matching skills found. You can add "{searchSkill}" as a custom skill.
                      </p>
                    )}
                  </div>
                )}
                
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Your skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <div
                          key={skill}
                          className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No skills added yet. Search and add your technical skills.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <DevButton
                  onClick={handlePrevious}
                  variant="outline"
                >
                  Back
                </DevButton>
                <DevButton
                  onClick={handleFinish}
                  isLoading={isLoading}
                >
                  Finish
                </DevButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupProfile;
