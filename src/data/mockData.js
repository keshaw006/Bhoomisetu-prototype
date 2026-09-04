// Comprehensive Mock Data for Bhoomisetu (SIH26016)
// Realistic Indian infrastructure land acquisition corridors

export const DEPARTMENTS = [
  {
    id: 'survey',
    name: 'Land Survey & Demarcation',
    shortName: 'Survey',
    weight: 0.15,
    roleTitle: 'Survey & Revenue Officer',
    icon: 'Compass',
    color: '#0284c7', // sky-600
    dependsOn: null,
    milestones: ['Aerial Drone LiDAR Survey', 'Cadastral Map Superimposition', 'Pillar Demarcation', 'Section 3A Gazette Notification']
  },
  {
    id: 'legal',
    name: 'Legal Title & Gazette Verification',
    shortName: 'Legal Verification',
    weight: 0.15,
    roleTitle: 'Competent Authority (CALA / Legal)',
    icon: 'Scale',
    color: '#6366f1', // indigo-500
    dependsOn: 'survey',
    milestones: ['7/12 & Khatauni Verification', 'Title Ownership Dispute Scrutiny', 'Public Hearing Objections (Sec 3C)', 'Final Section 3D Notification']
  },
  {
    id: 'compensation',
    name: 'Land Compensation & Award Disbursement',
    shortName: 'Compensation',
    weight: 0.30,
    roleTitle: 'District Land Acquisition Officer (DLAO)',
    icon: 'Coins',
    color: '#ef4444', // red-500
    dependsOn: 'legal',
    milestones: ['3G Award Value Determination', 'Direct Purchase / Fair Value Notice', 'Landowner Bank ECS / Aadhaar KYC', 'Fund Disbursement to Escrow']
  },
  {
    id: 'rehabilitation',
    name: 'Rehabilitation & Resettlement (R&R)',
    shortName: 'Rehabilitation',
    weight: 0.25,
    roleTitle: 'R&R Commissioner / Social Welfare',
    icon: 'Home',
    color: '#f59e0b', // amber-500
    dependsOn: 'compensation',
    milestones: ['Social Impact Assessment (SIA)', 'Alternate Housing Allotment', 'Subsistence & Transportation Grant', 'Vocational Skill Resettlement']
  },
  {
    id: 'possession',
    name: 'Physical Possession & Forest Handover',
    shortName: 'Possession',
    weight: 0.15,
    roleTitle: 'Executive Engineer / Handover In-charge',
    icon: 'Flag',
    color: '#10b981', // emerald-500
    dependsOn: 'rehabilitation',
    milestones: ['Section 3E Eviction/Taking Over Notice', 'Felling & Structure Demolition', 'Encroachment Clearance', 'Formal Handover Certificate to NHAI/Contractor']
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-001',
    code: 'NHAI-EXP-44',
    title: 'NH-44 Greenfield Expressway (Nashik-Nagpur Sec 4)',
    district: 'Nashik',
    state: 'Maharashtra',
    totalLandHa: 485.6,
    budgetCrores: 642.50,
    startDate: '2025-04-01',
    targetDate: '2026-03-31',
    durationMonths: 12,
    currentMonth: 7,
    plannedProgress: 72, // Based on timeline, should be at 72%
    status: 'Delayed', // Calculated by engine
    priority: 'High',
    nodalOfficer: 'Dr. Rajesh Deshmukh, IAS (Addl. District Magistrate)',
    departments: {
      survey: {
        progress: 100,
        plannedProgress: 100,
        status: 'Completed',
        completedCases: 1420,
        pendingCases: 0,
        delayReason: 'None',
        delayNotes: 'All 1420 parcels surveyed using DGPS and drone boundary coordinates.',
        expectedCompletionDate: '2025-07-15',
        lastUpdated: '2025-07-20',
        documents: ['Drone_Survey_GeoJSON_Sec4.kml', 'Sec3A_Gazette_Signed.pdf']
      },
      legal: {
        progress: 92,
        plannedProgress: 100,
        status: 'On Track',
        completedCases: 1306,
        pendingCases: 114,
        delayReason: 'Pending Khatauni Mutation Updates',
        delayNotes: 'Minor pending revenue record sync for 114 joint family parcels in Sinnar Taluka.',
        expectedCompletionDate: '2025-10-15',
        lastUpdated: '2025-10-02',
        documents: ['Sec3D_Notification_Final.pdf', 'Legal_Clearance_Report_V3.pdf']
      },
      compensation: {
        progress: 43,
        plannedProgress: 75,
        status: 'Delayed',
        completedCases: 610,
        pendingCases: 32, // Headline case from user prompt
        delayReason: 'Landowner verification pending & Heirship disputes',
        delayNotes: '32 key agricultural land parcels held up due to multiple family claimants and bank account Aadhaar linkage failures.',
        expectedCompletionDate: '2025-12-30',
        lastUpdated: '2025-10-18',
        documents: ['3G_Award_Summary_Sheet.xlsx', 'Escrow_Disbursement_Audit.pdf'],
        casesList: [
          { id: 'c-101', parcelNo: 'Sy. 142/2A', village: 'Ghoti Khurd', owner: 'Pandurang Sakharam Patil', areaAcres: 3.4, amountLakhs: 48.5, issue: 'Undivided ancestral share dispute between 3 brothers', status: 'Pending Verification' },
          { id: 'c-102', parcelNo: 'Sy. 89/1B', village: 'Wadivarhe', owner: 'Sunita Ramesh Shinde', areaAcres: 2.1, amountLakhs: 31.2, issue: 'Bank NPCI mapping failure for Direct Benefit Transfer', status: 'Bank Correction' },
          { id: 'c-103', parcelNo: 'Sy. 204/4', village: 'Pangri', owner: 'Ganesh Babanrao Jadhav', areaAcres: 5.6, amountLakhs: 82.0, issue: 'Court injunction filed in District Civil Court on valuation', status: 'Sub-Judice' },
          { id: 'c-104', parcelNo: 'Sy. 311/1', village: 'Sinnar Rural', owner: 'Dattatray V. Gaikwad', areaAcres: 1.8, amountLakhs: 26.4, issue: 'Legal heir certificate not issued by Tehsil office', status: 'Tehsil Follow-up' }
        ]
      },
      rehabilitation: {
        progress: 55,
        plannedProgress: 65,
        status: 'At Risk',
        completedCases: 198,
        pendingCases: 162,
        delayReason: 'Dependent on Compensation disbursement & Plot layout approval',
        delayNotes: 'Families waiting for compensation settlement before vacating current dwelling units in Project Affected Area.',
        expectedCompletionDate: '2026-01-30',
        lastUpdated: '2025-10-10',
        documents: ['R&R_Colony_Layout_Plan.pdf', 'SIA_Public_Consultation.pdf']
      },
      possession: {
        progress: 15,
        plannedProgress: 40,
        status: 'Delayed',
        completedCases: 72,
        pendingCases: 413,
        delayReason: 'Blocked: Awaiting R&R evacuation and compensation clearance',
        delayNotes: 'Civil contractor cannot begin earthworks until linear ROW is unencumbered.',
        expectedCompletionDate: '2026-03-31',
        lastUpdated: '2025-10-12',
        documents: ['Handover_Stretch_Chainage_42_to_56.pdf']
      }
    },
    executiveDirectives: [
      {
        id: 'dir-1',
        date: '2025-10-19',
        by: 'District Collector',
        message: 'Convene Special Joint Lok Adalat in Sinnar Tehsil for expedited resolution of 32 landowner heirship disputes in Sec-4 Compensation.',
        status: 'Active'
      }
    ]
  },
  {
    id: 'proj-002',
    code: 'MAHSR-C2',
    title: 'Mumbai-Ahmedabad Bullet Train Corridor (PKG-C2)',
    district: 'Palghar & Thane',
    state: 'Maharashtra',
    totalLandHa: 310.2,
    budgetCrores: 890.00,
    startDate: '2025-01-10',
    targetDate: '2025-12-31',
    durationMonths: 12,
    currentMonth: 9,
    plannedProgress: 85,
    status: 'At Risk',
    priority: 'Critical',
    nodalOfficer: 'Shri A. K. Sharma (Project Director, NHSRCL)',
    departments: {
      survey: {
        progress: 100,
        plannedProgress: 100,
        status: 'Completed',
        completedCases: 890,
        pendingCases: 0,
        delayReason: 'None',
        delayNotes: '100% boundary monuments installed with DGPS coordinates.',
        expectedCompletionDate: '2025-04-30',
        lastUpdated: '2025-05-02',
        documents: ['MAHSR_Survey_Report.pdf']
      },
      legal: {
        progress: 100,
        plannedProgress: 100,
        status: 'Completed',
        completedCases: 890,
        pendingCases: 0,
        delayReason: 'None',
        delayNotes: 'All gazette notifications under Sec 20A and 20E published.',
        expectedCompletionDate: '2025-06-20',
        lastUpdated: '2025-06-25',
        documents: ['Sec20E_Notification.pdf']
      },
      compensation: {
        progress: 88,
        plannedProgress: 95,
        status: 'On Track',
        completedCases: 785,
        pendingCases: 105,
        delayReason: 'Minor forest right verification claims',
        delayNotes: '₹510 Cr disbursed out of ₹580 Cr award pool. Residual claims under verification.',
        expectedCompletionDate: '2025-11-15',
        lastUpdated: '2025-10-14',
        documents: ['Disbursement_Summary_Q3.pdf']
      },
      rehabilitation: {
        progress: 68,
        plannedProgress: 80,
        status: 'At Risk',
        completedCases: 210,
        pendingCases: 98,
        delayReason: 'Resistance to transit shelter location',
        delayNotes: 'Local tribal consultation ongoing for alternate community grazing land.',
        expectedCompletionDate: '2025-12-10',
        lastUpdated: '2025-10-15',
        documents: ['FRA_Community_Certificate.pdf']
      },
      possession: {
        progress: 62,
        plannedProgress: 75,
        status: 'At Risk',
        completedCases: 550,
        pendingCases: 340,
        delayReason: 'Partial utility shifting pending (MSEDCL 33kV lines)',
        delayNotes: 'Civil contractor has commenced piling on 62% handed over continuous stretches.',
        expectedCompletionDate: '2025-12-31',
        lastUpdated: '2025-10-17',
        documents: ['Handover_Clearance_Thane.pdf']
      }
    },
    executiveDirectives: []
  },
  {
    id: 'proj-003',
    code: 'DFCCIL-EDFC-7',
    title: 'Eastern Dedicated Freight Corridor (Chandauli Bypass Sec)',
    district: 'Varanasi & Chandauli',
    state: 'Uttar Pradesh',
    totalLandHa: 275.0,
    budgetCrores: 410.00,
    startDate: '2025-02-01',
    targetDate: '2025-11-30',
    durationMonths: 10,
    currentMonth: 8,
    plannedProgress: 88,
    status: 'On Track',
    priority: 'Medium',
    nodalOfficer: 'Smt. Ananya Verma, IAS (Special Land Officer, EDFC)',
    departments: {
      survey: {
        progress: 100,
        plannedProgress: 100,
        status: 'Completed',
        completedCases: 650,
        pendingCases: 0,
        delayReason: 'None',
        delayNotes: 'Joint measurement survey completed with village lekhpals.',
        expectedCompletionDate: '2025-04-15',
        lastUpdated: '2025-04-20',
        documents: ['DFCCIL_JMS_Report.pdf']
      },
      legal: {
        progress: 98,
        plannedProgress: 100,
        status: 'Completed',
        completedCases: 638,
        pendingCases: 12,
        delayReason: 'Minor boundary rectification',
        delayNotes: 'Only 12 title verifications remaining for riverbank alluvial land.',
        expectedCompletionDate: '2025-07-30',
        lastUpdated: '2025-08-01',
        documents: ['Legal_Title_Varanasi.pdf']
      },
      compensation: {
        progress: 94,
        plannedProgress: 95,
        status: 'On Track',
        completedCases: 611,
        pendingCases: 39,
        delayReason: 'None',
        delayNotes: 'Special camps held in 14 villages; 94% award disbursed directly.',
        expectedCompletionDate: '2025-10-30',
        lastUpdated: '2025-10-15',
        documents: ['PFMS_Bank_Transfer_Receipts.pdf']
      },
      rehabilitation: {
        progress: 90,
        plannedProgress: 90,
        status: 'On Track',
        completedCases: 180,
        pendingCases: 20,
        delayReason: 'None',
        delayNotes: 'Resettlement allowances paid to all 180 eligible shopkeepers.',
        expectedCompletionDate: '2025-11-15',
        lastUpdated: '2025-10-16',
        documents: ['RR_Allowance_Receipts.pdf']
      },
      possession: {
        progress: 86,
        plannedProgress: 85,
        status: 'On Track',
        completedCases: 560,
        pendingCases: 90,
        delayReason: 'None',
        delayNotes: 'Pre-cast boundary wall erection in progress on 86% corridor length.',
        expectedCompletionDate: '2025-11-30',
        lastUpdated: '2025-10-18',
        documents: ['Possession_Notice_EDFC.pdf']
      }
    },
    executiveDirectives: []
  },
  {
    id: 'proj-004',
    code: 'BPRR-PH2',
    title: 'Bengaluru Peripheral Ring Road (Sarjapur - Hosur Link)',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    totalLandHa: 380.0,
    budgetCrores: 1250.00,
    startDate: '2025-03-01',
    targetDate: '2026-06-30',
    durationMonths: 16,
    currentMonth: 7,
    plannedProgress: 52,
    status: 'Delayed',
    priority: 'High',
    nodalOfficer: 'Sri K. Shivakumar (Special Land Acquisition Officer, BDA)',
    departments: {
      survey: {
        progress: 85,
        plannedProgress: 100,
        status: 'At Risk',
        completedCases: 765,
        pendingCases: 135,
        delayReason: 'High court stay on 14 lake buffer zone parcels',
        delayNotes: 'Environmental PIL requires revised alignment survey near Bellandur basin.',
        expectedCompletionDate: '2025-11-30',
        lastUpdated: '2025-10-05',
        documents: ['BDA_Survey_Notice.pdf']
      },
      legal: {
        progress: 60,
        plannedProgress: 80,
        status: 'Delayed',
        completedCases: 540,
        pendingCases: 360,
        delayReason: 'Pending RTC mutation and GPA scrutiny',
        delayNotes: 'Multiple power-of-attorney transactions requiring forensic fraud checks.',
        expectedCompletionDate: '2025-12-31',
        lastUpdated: '2025-10-12',
        documents: ['Legal_Scrutiny_Memo.pdf']
      },
      compensation: {
        progress: 30,
        plannedProgress: 50,
        status: 'Delayed',
        completedCases: 270,
        pendingCases: 630,
        delayReason: 'Farmers demanding commercial guidance value parity',
        delayNotes: 'Compensation rate dispute under committee review with Principal Secretary.',
        expectedCompletionDate: '2026-02-28',
        lastUpdated: '2025-10-16',
        documents: ['Guidance_Value_Deliberation.pdf']
      },
      rehabilitation: {
        progress: 20,
        plannedProgress: 35,
        status: 'Delayed',
        completedCases: 45,
        pendingCases: 180,
        delayReason: 'Awaiting BDA layout plot dimension finalization',
        delayNotes: 'Allotment letters held until Compensation award acceptance.',
        expectedCompletionDate: '2026-04-30',
        lastUpdated: '2025-10-10',
        documents: ['BDA_Developed_Plot_Allocation.pdf']
      },
      possession: {
        progress: 10,
        plannedProgress: 20,
        status: 'Delayed',
        completedCases: 90,
        pendingCases: 810,
        delayReason: 'Cascading block from Compensation and Survey disputes',
        delayNotes: 'Only undisputed government gomala lands taken into possession.',
        expectedCompletionDate: '2026-06-30',
        lastUpdated: '2025-10-14',
        documents: ['Government_Land_Takeover_Memo.pdf']
      }
    },
    executiveDirectives: [
      {
        id: 'dir-2',
        date: '2025-10-14',
        by: 'Chief Secretary',
        message: 'Form High-Level Valuation Committee to resolve commercial rate parity claims within 15 days.',
        status: 'Active'
      }
    ]
  }
];

export const USER_ROLES = [
  {
    id: 'senior_officer',
    name: 'District Collector / Divisional Commissioner',
    badge: 'Senior Officer (Management)',
    accessLevel: 'Executive',
    canEdit: 'all',
    description: 'Executive Control Room: Cross-department monitoring, bottleneck analytics, high-level directives.'
  },
  {
    id: 'project_manager',
    name: 'Project Director (NHAI / Dedicated Corridor)',
    badge: 'Project Manager',
    accessLevel: 'Management',
    canEdit: 'all',
    description: 'Corridor Level Management: Track schedule variance, risk assessment, downstream bottleneck forecast.'
  },
  {
    id: 'survey_officer',
    name: 'Survey & Revenue Inspector (SLO)',
    badge: 'Survey Officer',
    accessLevel: 'Department',
    departmentId: 'survey',
    canEdit: 'survey',
    description: 'Demarcation, cadastral map alignment, 3A notification data entry.'
  },
  {
    id: 'legal_officer',
    name: 'Competent Authority (Legal & Scrutiny)',
    badge: 'Legal Officer',
    accessLevel: 'Department',
    departmentId: 'legal',
    canEdit: 'legal',
    description: 'Title verification, objection hearings, khatauni mutations, 3D notices.'
  },
  {
    id: 'compensation_officer',
    name: 'Special Land Acquisition Officer (Compensation)',
    badge: 'Compensation Officer',
    accessLevel: 'Department',
    departmentId: 'compensation',
    canEdit: 'compensation',
    description: 'Award calculation, 32 pending landowner verification cases, PFMS disbursement.'
  },
  {
    id: 'rehabilitation_officer',
    name: 'R&R Officer (Social Impact & Resettlement)',
    badge: 'Rehabilitation Officer',
    accessLevel: 'Department',
    departmentId: 'rehabilitation',
    canEdit: 'rehabilitation',
    description: 'Displaced family resettlement, alternative housing allotment, grants.'
  },
  {
    id: 'possession_officer',
    name: 'Executive Engineer (Physical Possession)',
    badge: 'Possession Officer',
    accessLevel: 'Department',
    departmentId: 'possession',
    canEdit: 'possession',
    description: 'Civil handover, fence demarcation, encumbrance-free corridor sign-off.'
  }
];
