export type PersonalInfo = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

export type JobLetterData = {
  jobTitle: string;
  companyName: string;
  hiringManager: string;
  introduction: string;
  skills: string[];
  experience: string;
  closing: string;
  date: string;
};

export type CoverLetterData = PersonalInfo & JobLetterData;

export type CoverLetterTemplate = {
  id: string;
  name: string;
  description: string;
  template: string;
  sampleData: JobLetterData;
};
