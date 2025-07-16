export type CoverLetterData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  jobTitle: string;
  companyName: string;
  hiringManager: string;
  introduction: string;
  skills: string[];
  experience: string;
  closing: string;
  date: string;
}

export type CoverLetterTemplate = {
  id: string;
  name: string;
  description: string;
  template: string;
  sampleData: CoverLetterData;
}
