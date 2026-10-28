import { GovService, ApplicationRecord, ComplaintRecord, GovOffice, UserNotification } from '../types/sewa';

export const mockGovServices: GovService[] = [
  {
    id: 'scholarship-postmatric',
    name: 'Post-Matric Scholarship Scheme',
    nameMl: 'പോസ്റ്റ് മെട്രിക് സ്കോളർഷിപ്പ് പദ്ധതി',
    nameHi: 'पोस्ट-मैट्रिक छात्रवृत्ति योजना',
    category: 'scholarships',
    department: 'Department of Higher Education & Minority Welfare',
    description: 'Financial assistance for post-secondary students belonging to eligible socio-economic backgrounds.',
    descriptionMl: 'ഉന്നത വിദ്യാഭ്യാസം നടത്തുന്ന അർഹരായ വിദ്യാർത്ഥികൾക്കുള്ള ധനസഹായ പദ്ധതി.',
    descriptionHi: 'पात्र सामाजिक-आर्थिक पृष्ठभूमि के उत्तर-माध्यमिक छात्रों के लिए वित्तीय सहायता।',
    targetAudience: 'Class 11 to Ph.D. students enrolled in recognized institutions',
    eligibilityCriteria: {
      maxIncome: 250000, // Annual family income limit in INR
      studentOnly: true,
      courseRequirement: ['Class 11', 'Class 12', 'Diploma', 'Undergraduate (UG)', 'Postgraduate (PG)', 'Ph.D.'],
      allowedCategories: ['OBC', 'SC', 'ST', 'EWS'],
      residenceState: ['Kerala', 'All India'],
    },
    requiredDocuments: [
      'Aadhaar Card / ID Proof',
      'Income Certificate (Issued by Village Officer/Tahsildar)',
      'Student ID / Bonafide Certificate from College',
      'Bank Account Passbook (Linked to Aadhaar)',
      'Community / Caste Certificate (if applicable)',
      'Previous Academic Marksheets'
    ],
    processingTime: '15 - 30 Working Days',
    officialPortalUrl: 'https://scholarships.gov.in',
    iconName: 'GraduationCap',
    isPopular: true
  },
  {
    id: 'scholarship-merit',
    name: 'Higher Education Merit Scholarship',
    nameMl: 'ഉന്നത വിദ്യാഭ്യാസ മെറിറ്റ് സ്കോളർഷിപ്പ്',
    nameHi: 'उच्च शिक्षा मेधा छात्रवृत्ति',
    category: 'scholarships',
    department: 'State Collegiate Education Department',
    description: 'Merit-based financial aid for top performing undergraduate and postgraduate university students.',
    descriptionMl: 'ഉന്നത വിജയം നേടുന്ന ഡിഗ്രി, പിജി വിദ്യാർത്ഥികൾക്കുള്ള മെറിറ്റ് സ്കോളർഷിപ്പ്.',
    descriptionHi: 'शीर्ष प्रदर्शन करने वाले स्नातक और स्नातकोत्तर विश्वविद्यालय छात्रों के लिए मेधा छात्रवृत्ति।',
    targetAudience: 'UG and PG university students with >65% marks in qualifying exams',
    eligibilityCriteria: {
      maxIncome: 500000,
      studentOnly: true,
      courseRequirement: ['Undergraduate (UG)', 'Postgraduate (PG)'],
      allowedCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      residenceState: ['Kerala'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'SSLC / Class 10 Certificate',
      'Higher Secondary / Class 12 Marksheet',
      'College Bonafide Certificate',
      'Bank Passbook Copy'
    ],
    processingTime: '20 Working Days',
    officialPortalUrl: 'https://collegiateedu.kerala.gov.in',
    iconName: 'Award',
    isPopular: true
  },
  {
    id: 'scholarship-nmms',
    name: 'National Means-cum-Merit Scholarship (NMMS)',
    nameMl: 'ദേശീയ മീൻസ്-കം-മെറിറ്റ് സ്കോളർഷിപ്പ്',
    nameHi: 'राष्ट्रीय साधन-सह-मेधा छात्रवृत्ति (NMMS)',
    category: 'scholarships',
    department: 'Ministry of Education',
    description: 'Scholarship awarded to meritorious students from economically weaker sections to arrest dropouts at Class 8.',
    descriptionMl: 'സാമ്പത്തികമായി പിന്നാക്കം നിൽക്കുന്ന മികവുറ്റ സ്കൂൾ വിദ്യാർത്ഥികൾക്കുള്ള സ്കോളർഷിപ്പ്.',
    descriptionHi: 'कक्षा 8 में पढ़ाई छोड़ने से रोकने के लिए आर्थिक रूप से कमजोर वर्ग के प्रतिभाशाली छात्रों को छात्रवृत्ति।',
    targetAudience: 'Students studying in Class 9 to Class 12 in Govt/Aided schools',
    eligibilityCriteria: {
      maxIncome: 350000,
      studentOnly: true,
      courseRequirement: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
      allowedCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    },
    requiredDocuments: [
      'Class 8 Marksheet',
      'Parental Income Certificate',
      'Aadhaar Card',
      'Bank Account Details'
    ],
    processingTime: '30 Working Days',
    iconName: 'BookOpen'
  },
  {
    id: 'pension-oldage',
    name: 'Indira Gandhi National Old Age Pension (IGNOAP)',
    nameMl: 'ഇന്ദിരാഗാന്ധി ദേശീയ വാർദ്ധക്യകാല പെൻഷൻ',
    nameHi: 'इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना',
    category: 'pensions',
    department: 'Department of Social Justice & Welfare',
    description: 'Monthly pension scheme for senior citizens belonging to Below Poverty Line (BPL) households.',
    descriptionMl: 'ബി.പി.എൽ വിഭാഗത്തിലെ മുതിർന്ന പൗരന്മാർക്ക് പ്രതിമാസ ധനസഹായം.',
    descriptionHi: 'गरीबी रेखा से नीचे (बीपीएल) परिवारों के वरिष्ठ नागरिकों के लिए मासिक पेंशन योजना।',
    targetAudience: 'Senior citizens aged 60 years and above',
    eligibilityCriteria: {
      minAge: 60,
      maxIncome: 100000, // BPL threshold
      allowedCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      residenceState: ['Kerala', 'All India']
    },
    requiredDocuments: [
      'Age Proof (Aadhaar / Voter ID / Birth Certificate)',
      'BPL Ration Card / Income Certificate',
      'Bank Account Details (Aadhaar Seeded)',
      'Passport Size Photo'
    ],
    processingTime: '30 - 45 Working Days',
    iconName: 'HeartHandshake',
    isPopular: true
  },
  {
    id: 'pension-disability',
    name: 'Indira Gandhi Disability Pension Scheme',
    nameMl: 'ഇന്ദിരാഗാന്ധി ഭിന്നശേഷി പെൻഷൻ പദ്ധതി',
    nameHi: 'इंदिरा गांधी विकलांगता पेंशन योजना',
    category: 'pensions',
    department: 'Social Welfare Board',
    description: 'Financial support for persons with severe disabilities (40% or more disability degree).',
    descriptionMl: '40% അതിലധികമോ വൈകല്യമുള്ള ഭിന്നശേഷിക്കാർക്കുള്ള ക്ഷേമ പെൻഷൻ.',
    descriptionHi: 'गंभीर विकलांगता (40% या अधिक) वाले व्यक्तियों के लिए वित्तीय सहायता।',
    targetAudience: 'Persons with disability certified by Medical Board',
    eligibilityCriteria: {
      minAge: 18,
      maxIncome: 150000,
      otherConditions: ['40%+ certified disability']
    },
    requiredDocuments: [
      'Disability Certificate from Govt Medical Board / UDID Card',
      'Income Proof',
      'Aadhaar Card',
      'Bank Passbook Copy'
    ],
    processingTime: '25 Working Days',
    iconName: 'Accessibility'
  },
  {
    id: 'certificate-income',
    name: 'Income & Assets Certificate (e-District)',
    nameMl: 'വരുമാന സർട്ടിഫിക്കറ്റ് (ഇ-ഡിസ്ട്രിക്ട്)',
    nameHi: 'आय और संपत्ति प्रमाणपत्र (ई-डिस्ट्रिक्ट)',
    category: 'certificates',
    department: 'Revenue Department',
    description: 'Official Revenue Department certificate certifying annual family income from all sources.',
    descriptionMl: 'വില്ലേജ് ഓഫീസിൽ നിന്നുള്ള ഔദ്യോഗിക കുടുംബ വാർഷിക വരുമാന സർട്ടിഫിക്കറ്റ്.',
    descriptionHi: 'सभी स्रोतों से वार्षिक पारिवारिक आय प्रमाणित करने वाला आधिकारिक राजस्व विभाग का प्रमाणपत्र।',
    targetAudience: 'Any resident citizen needing income proof for scholarships, admissions, or welfare',
    eligibilityCriteria: {
      residenceState: ['Kerala']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card Copy',
      'Salary Certificate / Tax Return (if employed)',
      'Self-Declaration Form'
    ],
    processingTime: '3 - 7 Working Days',
    iconName: 'FileCheck2',
    isPopular: true
  },
  {
    id: 'certificate-birth',
    name: 'Birth Certificate Issue & Correction',
    nameMl: 'ജനന സർട്ടിഫിക്കറ്റ് വിതരണവും തിരുത്തലും',
    nameHi: 'जन्म प्रमाणपत्र जारी करना और संशोधन',
    category: 'certificates',
    department: 'Local Self Government / Municipality / Corporation',
    description: 'Official vital record certificate issued by local Panchayath / Municipality / Corporation.',
    descriptionMl: 'തദ്ദേശ സ്വയംഭരണ സ്ഥാപനം വഴി നൽകുന്ന ജനന സർട്ടിഫിക്കറ്റ്.',
    descriptionHi: 'स्थानीय पंचायत / नगरपालिका / नगर निगम द्वारा जारी आधिकारिक जन्म प्रमाणपत्र।',
    targetAudience: 'Parents or individuals seeking fresh birth certificate or record correction',
    eligibilityCriteria: {},
    requiredDocuments: [
      'Hospital Discharge Summary / Birth Report',
      'Parents Aadhaar Card / ID Proof',
      'Marriage Certificate (for child name inclusion)',
      'Application Form'
    ],
    processingTime: '5 Working Days',
    iconName: 'Baby'
  },
  {
    id: 'healthcare-ayushman',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    nameMl: 'ആയുഷ്മാൻ ഭാരത് സൗജന്യ ചികിത്സാ കാർഡ്',
    nameHi: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (PM-JAY)',
    category: 'healthcare',
    department: 'National Health Authority & State Health Agency',
    description: 'Cashless health insurance cover up to ₹5 Lakh per family per year for secondary and tertiary hospitalization.',
    descriptionMl: 'കുടുംബത്തിന് പ്രതിവർഷം 5 ലക്ഷം രൂപ വരെയുള്ള സൗജന്യ ആശുപത്രി ചികിത്സാ പരിരക്ഷ.',
    descriptionHi: 'द्वितीयक और तृतीयक अस्पताल में भर्ती के लिए प्रति वर्ष प्रति परिवार ₹5 लाख तक का कैशलेस स्वास्थ्य बीमा कवर।',
    targetAudience: 'Eligible SECC/BPL households',
    eligibilityCriteria: {
      maxIncome: 120000,
      allowedCategories: ['General', 'OBC', 'SC', 'ST', 'EWS']
    },
    requiredDocuments: [
      'Aadhaar Card of all family members',
      'Ration Card / SECC Data proof',
      'Active Mobile Number'
    ],
    processingTime: 'Instant / 2 Working Days',
    iconName: 'ShieldPlus',
    isPopular: true
  },
  {
    id: 'healthcare-karunya',
    name: 'Karunya Health Security Scheme (KISP)',
    nameMl: 'കാരുണ്യ ആരോഗ്യ സുരക്ഷാ പദ്ധതി',
    nameHi: 'कारुण्य स्वास्थ्य सुरक्षा योजना',
    category: 'healthcare',
    department: 'State Health Agency Kerala',
    description: 'Comprehensive health coverage scheme providing financial aid for major life-threatening ailments.',
    descriptionMl: 'ഗുരുതര രോഗങ്ങൾക്ക് സൗജന്യ ചികിത്സയും സാമ്പത്തിക സഹായവും നൽകുന്ന പദ്ധതി.',
    descriptionHi: 'गंभीर जीवन-घातक बीमारियों के लिए वित्तीय सहायता प्रदान करने वाली व्यापक स्वास्थ्य कवर योजना।',
    targetAudience: 'State residents listed under eligible BPL and poor family categories',
    eligibilityCriteria: {
      residenceState: ['Kerala']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card',
      'Medical Certificate from Hospital Doctor'
    ],
    processingTime: '3 Working Days',
    iconName: 'Cross'
  },
  {
    id: 'employment-pmegp',
    name: 'Prime Minister Employment Generation Programme (PMEGP)',
    nameMl: 'പ്രധാനമന്ത്രി തൊഴിൽ ദായക പദ്ധതി (PMEGP)',
    nameHi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)',
    category: 'employment',
    department: 'Khadi & Village Industries Commission (KVIC)',
    description: 'Credit linked subsidy program for setting up micro-enterprises in manufacturing and service sectors.',
    descriptionMl: 'സ്വയംതൊഴിൽ സംരംഭങ്ങൾ ആരംഭിക്കുന്നതിനുള്ള ബാങ്ക് വായ്പയും സബ്‌സിഡിയും.',
    descriptionHi: 'निर्माण और सेवा क्षेत्रों में सूक्ष्म उद्यमों की स्थापना के लिए क्रेडिट लिंक्ड सब्सिडी कार्यक्रम।',
    targetAudience: 'Aspiring entrepreneurs aged 18 and above',
    eligibilityCriteria: {
      minAge: 18,
      courseRequirement: ['Class 8 Pass (for projects above ₹10L)']
    },
    requiredDocuments: [
      'Project Proposal / Business Plan Report',
      'Aadhaar Card & PAN Card',
      'Educational Qualification Certificate',
      'EDP Training Certificate (if completed)',
      'Caste / Community Certificate (for higher subsidy)'
    ],
    processingTime: '30 - 60 Working Days',
    iconName: 'Briefcase'
  },
  {
    id: 'grievance-infrastructure',
    name: 'Public Infrastructure & Road Pothole Grievance',
    nameMl: 'പൊതു റോഡ് തിരുത്തൽ & ഇൻഫ്രാസ്ട്രക്ചർ പരാതി',
    nameHi: 'सार्वजनिक अवसंरचना और सड़क गड्ढे की शिकायत',
    category: 'complaints',
    department: 'Public Works Department (PWD) / Local Body',
    description: 'Report hazardous road potholes, damaged streetlights, broken drainage covers, or public property damage.',
    descriptionMl: 'തകർന്ന റോഡുകൾ, പ്രവർത്തിക്കാത്ത തെരുവ് വിളക്കുകൾ എന്നിവ റിപ്പോർട്ട് ചെയ്യുക.',
    descriptionHi: 'खतरनाक सड़क के गड्ढों, क्षतिग्रस्त स्ट्रीट लाइटों, टूटे जल निकासी कवर की रिपोर्ट करें।',
    targetAudience: 'All citizens',
    eligibilityCriteria: {},
    requiredDocuments: [
      'Site Photograph',
      'GPS Location details',
      'Complainant Contact Details'
    ],
    processingTime: '3 - 7 Working Days',
    iconName: 'AlertTriangle'
  }
];

export const mockGovOffices: GovOffice[] = [
  {
    id: 'off-tvm-taluk',
    name: 'Thiruvananthapuram Taluk Office',
    nameMl: 'തിരുവനന്തപുരം താലൂക്ക് ഓഫീസ്',
    department: 'Revenue Department',
    district: 'Thiruvananthapuram',
    address: 'Near East Fort, Collectorate Junction, Thiruvananthapuram, Kerala 695023',
    contactNumber: '0471-2461470',
    email: 'tah-tvm.rev@kerala.gov.in',
    workingHours: '10:00 AM - 5:00 PM (Mon-Sat, Excl 2nd/4th Sat)',
    latitude: 8.4855,
    longitude: 76.9492,
    servicesProvided: ['Income Certificate', 'Caste Certificate', 'NLC', 'Land Revenue & Tax']
  },
  {
    id: 'off-ekm-collectorate',
    name: 'Ernakulam Civil Station & District Collectorate',
    nameMl: 'എറണാകുളം കളക്ടറേറ്റ് & സിവിൽ സ്റ്റേഷൻ',
    department: 'Revenue & District Administration',
    district: 'Ernakulam',
    address: 'Kakkanad, Kochi, Kerala 682030',
    contactNumber: '0484-2423001',
    email: 'dc.ekm@kerala.gov.in',
    workingHours: '10:00 AM - 5:00 PM (Mon-Sat)',
    latitude: 10.0159,
    longitude: 76.3419,
    servicesProvided: ['Post-Matric Scholarships', 'Ayushman Bharat Registration', 'Social Welfare Pensions', 'Grievance Redressal']
  },
  {
    id: 'off-clt-corporation',
    name: 'Kozhikode Municipal Corporation Main Office',
    nameMl: 'കോഴിക്കോട് കോർപ്പറേഷൻ പ്രധാന ഓഫീസ്',
    department: 'Local Self Government Department',
    district: 'Kozhikode',
    address: 'Calicut Beach Road, Kozhikode, Kerala 673032',
    contactNumber: '0495-2365040',
    email: 'secretary.corporation.clt@gmail.com',
    workingHours: '09:30 AM - 05:00 PM',
    latitude: 11.2588,
    longitude: 75.7804,
    servicesProvided: ['Birth Certificate', 'Building Permits', 'Trade License', 'Streetlight Grievance']
  },
  {
    id: 'off-tsr-rto',
    name: 'Thrissur Sub Regional Transport Office & Civil Station',
    nameMl: 'തൃശ്ശൂർ സിവിൽ സ്റ്റേഷൻ',
    department: 'Motor Vehicles & Social Justice',
    district: 'Thrissur',
    address: 'Ayyanthole, Thrissur, Kerala 680003',
    contactNumber: '0487-2360000',
    email: 'rto.tsr@kerala.gov.in',
    workingHours: '10:00 AM - 05:00 PM',
    latitude: 10.5276,
    longitude: 76.2144,
    servicesProvided: ['Disability Pension Verification', 'Higher Education Merit Scheme', 'Public Utilities']
  }
];

export const mockInitialApplications: ApplicationRecord[] = [
  {
    referenceId: 'SWA-2026-102431',
    serviceId: 'scholarship-postmatric',
    serviceName: 'Post-Matric Scholarship Scheme',
    category: 'scholarships',
    department: 'Department of Higher Education',
    applicant: {
      fullName: 'Ananya Ramesh',
      age: 20,
      gender: 'Female',
      state: 'Kerala',
      district: 'Ernakulam',
      pincode: '682030',
      isStudent: true,
      courseName: 'B.Tech Computer Science',
      institution: 'Government Engineering College, Barton Hill',
      annualIncome: 180000,
      category: 'OBC',
      contactNumber: '+91 9876543210',
      email: 'ananya.r@example.com',
      uploadedDocs: {
        'Aadhaar Card': true,
        'Income Certificate': true,
        'Student ID': true,
        'Bank Passbook': true
      }
    },
    submittedAt: '2026-09-02 11:30 AM',
    currentStatus: 'Under Review',
    timeline: [
      { status: 'Created', timestamp: '2026-09-02 11:30 AM', note: 'Application generated via SewaAI Assistant', completed: true },
      { status: 'Documents Submitted', timestamp: '2026-09-02 11:35 AM', note: 'Aadhaar, Income & Student ID verified', completed: true },
      { status: 'Under Review', timestamp: '2026-09-05 02:15 PM', note: 'File assigned to District Welfare Officer (Ernakulam)', completed: true },
      { status: 'Department Verification', timestamp: 'Pending', note: 'Awaiting institution mark list verification', completed: false },
      { status: 'Approved', timestamp: 'Pending', note: 'Final sanction by Collegiate Education Directorate', completed: false },
      { status: 'Completed', timestamp: 'Pending', note: 'Direct Benefit Transfer (DBT) to bank account', completed: false }
    ],
    documentsAttached: ['Aadhaar_Ananya.pdf', 'Income_Cert_2026.pdf', 'College_ID.jpg', 'Bank_Passbook.pdf'],
    estimatedCompletion: '2026-09-22'
  },
  {
    referenceId: 'SWA-2026-881902',
    serviceId: 'pension-oldage',
    serviceName: 'Indira Gandhi National Old Age Pension (IGNOAP)',
    category: 'pensions',
    department: 'Department of Social Justice & Welfare',
    applicant: {
      fullName: 'K. Vasudevan Nair',
      age: 68,
      gender: 'Male',
      state: 'Kerala',
      district: 'Thiruvananthapuram',
      pincode: '695001',
      isStudent: false,
      annualIncome: 45000,
      category: 'General',
      contactNumber: '+91 9447123456',
      uploadedDocs: {
        'Age Proof': true,
        'BPL Ration Card': true,
        'Bank Account Details': true
      }
    },
    submittedAt: '2026-08-20 10:15 AM',
    currentStatus: 'Approved',
    timeline: [
      { status: 'Created', timestamp: '2026-08-20 10:15 AM', note: 'Application initiated via SewaAI Voice & Chat', completed: true },
      { status: 'Documents Submitted', timestamp: '2026-08-20 10:20 AM', note: 'Age proof and BPL Ration Card submitted', completed: true },
      { status: 'Under Review', timestamp: '2026-08-24 09:00 AM', note: 'Field inquiry completed by Village Officer', completed: true },
      { status: 'Department Verification', timestamp: '2026-08-28 04:30 PM', note: 'Recommended by Tahsildar for sanction', completed: true },
      { status: 'Approved', timestamp: '2026-09-01 11:00 AM', note: 'Pension order issued: PENS-TVM-2026-091', completed: true },
      { status: 'Completed', timestamp: '2026-09-10 09:00 AM', note: 'First monthly installment of ₹1,600 disbursed', completed: true }
    ],
    documentsAttached: ['Aadhaar_Vasudevan.pdf', 'RationCard_BPL.pdf', 'Bank_Passbook.pdf'],
    estimatedCompletion: 'Completed'
  }
];

export const mockInitialComplaints: ComplaintRecord[] = [
  {
    complaintId: 'CMP-2026-30192',
    category: 'Infrastructure & Road Potholes',
    location: 'Near Civil Station Junction, Kakkanad',
    district: 'Ernakulam',
    description: 'Deep hazardous pothole causing heavy traffic slowdown and risk to two-wheelers during rain.',
    submittedAt: '2026-09-08 04:20 PM',
    contactName: 'Rahul Menon',
    contactPhone: '+91 9745112233',
    status: 'Under Investigation',
    assignedOfficer: 'Assistant Executive Engineer, PWD Roads Division Kakkanad',
    timeline: [
      { status: 'Complaint Registered', timestamp: '2026-09-08 04:20 PM', note: 'Grievance ticket created with geo-photo' },
      { status: 'Assigned', timestamp: '2026-09-09 10:00 AM', note: 'Transferred to PWD Assistant Engineer' },
      { status: 'Under Investigation', timestamp: '2026-09-10 02:00 PM', note: 'Site inspection conducted; repair tender scheduled' },
      { status: 'Resolved', timestamp: 'Pending', note: 'Patchwork repair execution' }
    ],
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
  }
];

export const mockNotifications: UserNotification[] = [
  {
    id: 'notif-1',
    title: 'Scholarship Update',
    message: 'Your Post-Matric Scholarship application (SWA-2026-102431) has moved to Under Review stage.',
    timestamp: '2 hours ago',
    read: false,
    type: 'application_update',
    referenceId: 'SWA-2026-102431'
  },
  {
    id: 'notif-2',
    title: 'Grievance Assigned',
    message: 'Your complaint CMP-2026-30192 (Road Potholes) has been assigned to PWD Assistant Engineer Kakkanad.',
    timestamp: '1 day ago',
    read: false,
    type: 'complaint_update',
    referenceId: 'CMP-2026-30192'
  },
  {
    id: 'notif-3',
    title: 'Pension Sanctioned!',
    message: 'Old Age Pension application (SWA-2026-881902) has been fully approved & completed!',
    timestamp: '2 days ago',
    read: true,
    type: 'application_update',
    referenceId: 'SWA-2026-881902'
  }
];
