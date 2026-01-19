// Oman Country Code
export const OMAN_COUNTRY_CODE = '968';

// Resource Types with colors for badges
export const RESOURCE_TYPES = [
    { id: 'summary', name: 'Summary', nameAr: 'ملخص', color: 'bg-blue-500' },
    { id: 'past-exam', name: 'Past Exam', nameAr: 'امتحان سابق', color: 'bg-red-500' },
    { id: 'notes', name: 'Notes', nameAr: 'ملاحظات', color: 'bg-green-500' },
    { id: 'project', name: 'Project', nameAr: 'مشروع', color: 'bg-purple-500' },
];

// Universities in Oman
export const UNIVERSITIES = [
    { id: 'utas', name: 'University of Technology and Applied Sciences', domain: 'utas.edu.om' },
];

// Majors/Departments
export const MAJORS = [
    'Computer Science',
    'Information Technology',
    'Engineering',
    'Business Administration',
    'Medicine',
    'Pharmacy',
    'Law',
    'Arts & Humanities',
    'Education',
    'Economics',
    'Accounting',
    'Marketing',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Architecture',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Environmental Science',
    'Psychology',
    'Sociology',
    'Media & Communications',
    'Nursing',
    'Dentistry',
    'Other',
];

// Library categories for Open Library integration
export const LIBRARY_CATEGORIES = [
    { id: 'textbooks', name: 'Textbooks', nameAr: 'كتب دراسية', query: 'textbook free' },
    { id: 'science', name: 'Science', nameAr: 'علوم', query: 'science textbook free' },
    { id: 'mathematics', name: 'Mathematics', nameAr: 'رياضيات', query: 'mathematics textbook free' },
    { id: 'engineering', name: 'Engineering', nameAr: 'هندسة', query: 'engineering textbook free' },
    { id: 'business', name: 'Business', nameAr: 'إدارة أعمال', query: 'business textbook free' },
    { id: 'computer', name: 'Computer Science', nameAr: 'علوم الحاسوب', query: 'computer science textbook free' },
    { id: 'medicine', name: 'Medicine', nameAr: 'طب', query: 'medicine textbook free' },
    { id: 'literature', name: 'Literature', nameAr: 'أدب', query: 'literature textbook free' },
];

// Session Security Settings
export const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
export const SESSION_WARNING_MS = 2 * 60 * 1000; // Warning 2 minutes before timeout (optional future use)
