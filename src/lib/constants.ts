// Omani Universities
export const UNIVERSITIES = [
    { id: 'squ', name: 'Sultan Qaboos University' },
    { id: 'gutech', name: 'German University of Technology in Oman (GUtech)' },
    { id: 'uob', name: 'University of Buraimi' },
    { id: 'du', name: 'Dhofar University' },
    { id: 'nu', name: 'Nizwa University' },
    { id: 'su', name: 'Sohar University' },
    { id: 'mu', name: 'Middle East College' },
    { id: 'ccq', name: 'Caledonian College of Engineering' },
    { id: 'gcet', name: 'Gulf College' },
    { id: 'mct', name: 'Modern College of Business and Science' },
    { id: 'ou', name: 'Oman Medical College' },
    { id: 'other', name: 'Other' },
] as const;

// Book Conditions
export const BOOK_CONDITIONS = [
    { id: 'new', name: 'New', description: 'Brand new, never used' },
    { id: 'like-new', name: 'Like New', description: 'Minimal wear, looks new' },
    { id: 'good', name: 'Good', description: 'Some wear but fully functional' },
    { id: 'fair', name: 'Fair', description: 'Noticeable wear, still usable' },
    { id: 'poor', name: 'Poor', description: 'Heavy wear, may have markings' },
] as const;

// Common Majors
export const MAJORS = [
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Medicine',
    'Law',
    'Architecture',
    'Education',
    'Arts & Humanities',
    'Natural Sciences',
    'Mathematics',
    'Economics',
    'Psychology',
    'Pharmacy',
    'Nursing',
    'Other',
] as const;

// Price range for filters (in OMR)
export const PRICE_RANGES = [
    { id: 'any', label: 'Any Price', min: 0, max: Infinity },
    { id: '0-5', label: '0 - 5 OMR', min: 0, max: 5 },
    { id: '5-10', label: '5 - 10 OMR', min: 5, max: 10 },
    { id: '10-20', label: '10 - 20 OMR', min: 10, max: 20 },
    { id: '20-50', label: '20 - 50 OMR', min: 20, max: 50 },
    { id: '50+', label: '50+ OMR', min: 50, max: Infinity },
] as const;

// App metadata
export const APP_CONFIG = {
    name: 'Academic Exchange',
    tagline: 'Buy & Sell Textbooks in Oman',
    description: 'The trusted marketplace for Omani university students to buy and sell used textbooks.',
};
