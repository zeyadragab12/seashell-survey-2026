// Seashell Survey 2026 — question schema, mirrored from the original static
// index.html (Q1-Q24) so copy, field names, and required rules stay identical.

export const RATING_OPTIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'N/A']
export const RATING_OPTIONS_NO_NA = ['Excellent', 'Good', 'Fair', 'Poor']

export const sections = [
  {
    id: 1,
    title: 'OneCommunity App',
    subtitle: 'Tell us about your experience using the app this season.',
    heroImage: '/img/logo/app.jpg',
    heroAlt: 'OneCommunity App Logo',
    nextLabel: 'Next: Beach & Commercial',
    questions: [
      {
        type: 'rating',
        number: 1,
        name: 'q1',
        label: 'How would you rate your overall experience with the OneCommunity App?',
        required: true,
        options: RATING_OPTIONS,
      },
      {
        type: 'matrix',
        number: 2,
        label: 'How would you rate the following aspects of the OneCommunity App?',
        required: true,
        rows: [
          { name: 'q2_ease', label: 'Ease of use' },
          { name: 'q2_guests', label: 'Guest passes & invitations' },
          { name: 'q2_payments', label: 'Payments & service requests' },
          { name: 'q2_notifications', label: 'Notifications & community updates' },
          { name: 'q2_reliability', label: 'Reliability & performance' },
        ],
      },
      {
        type: 'textarea',
        number: 3,
        name: 'q3_comment',
        label:
          'What is the thing you would most like us to improve or add to the OneCommunity App for Summer 2027?',
        required: false,
      },
    ],
  },
  {
    id: 2,
    title: 'Beach & Commercial',
    subtitle: 'Tell us about your beach and commercial experience this season.',
    heroImage: '/img/logo/beach-emblem.jpg',
    heroAlt: 'Beach and Commercial Logo',
    nextLabel: 'Next Section',
    questions: [
      {
        type: 'rating',
        number: 4,
        name: 'q4',
        label: 'How would you rate your overall beach experience this summer?',
        required: true,
        options: RATING_OPTIONS,
      },
      {
        type: 'matrix',
        number: 5,
        label: 'How would you rate the following aspects of your beach experience?',
        required: true,
        rows: [
          { name: 'q5_cleanliness', label: 'Cleanliness & overall condition' },
          { name: 'q5_furniture', label: 'Beach furniture & facilities' },
          { name: 'q5_team', label: 'Beach team & lifeguards' },
          { name: 'q5_guest_mgmt', label: 'Organisation & guest management' },
          { name: 'q5_atmosphere', label: 'Overall beach atmosphere' },
          { name: 'q5_outlets', label: 'Commercial outlets & variety' },
        ],
      },
      {
        type: 'checkboxGroup',
        number: 6,
        name: 'q6_priorities',
        label: 'Looking ahead to Summer 2027, which areas should we prioritise most?',
        helper: 'Select all that apply',
        required: false,
        options: [
          { value: 'Beach furniture & facilities', label: 'Beach furniture & facilities', icon: 'Umbrella' },
          { value: 'Cleanliness & maintenance', label: 'Cleanliness & maintenance', icon: 'Sparkles' },
          { value: 'Beach team & lifeguards', label: 'Beach team & lifeguards', icon: 'LifeBuoy' },
          { value: 'Beach organisation', label: 'Beach organisation', icon: 'ClipboardCheck' },
          { value: 'Guest management', label: 'Guest management', icon: 'Users' },
          { value: 'Commercial outlets & variety', label: 'Commercial outlets & variety', icon: 'Store' },
          { value: 'Other', label: 'Other', icon: 'MessageCircle' },
        ],
      },
      {
        type: 'textarea',
        number: 7,
        name: 'q7_comment',
        label: 'What else would you like us to know about your beach and commercial experience?',
        required: false,
      },
    ],
  },
  {
    id: 3,
    title: 'Facilities Management',
    subtitle: 'Tell us about your experience with Facilities Management this season.',
    heroImage: '/img/logo/Fm-emblem.jpg',
    heroAlt: 'Facilities Management Logo',
    nextLabel: 'Next Section',
    questions: [
      {
        type: 'rating',
        number: 8,
        name: 'q8',
        label: 'How would you rate your overall experience with Facilities Management this season?',
        required: true,
        options: RATING_OPTIONS,
      },
      {
        type: 'matrix',
        number: 9,
        label: 'How would you rate the following FM services?',
        required: true,
        rows: [
          { name: 'q9_engineering', label: 'Engineering & maintenance' },
          { name: 'q9_housekeeping', label: 'Housekeeping & cleanliness' },
          { name: 'q9_landscaping', label: 'Landscaping' },
          { name: 'q9_pest', label: 'Pest control' },
          { name: 'q9_paid_services', label: 'Paid unit services' },
        ],
      },
      {
        type: 'rating',
        number: 10,
        name: 'q10',
        label: 'For services you requested this season, how would you rate the response and resolution?',
        required: true,
        options: RATING_OPTIONS,
      },
      {
        type: 'checkboxGroup',
        number: 11,
        name: 'q11_priorities',
        label: 'Which FM areas should we prioritise most for Summer 2027?',
        helper: 'Select all that apply',
        required: false,
        options: [
          { value: 'Engineering & maintenance', label: 'Engineering & maintenance', icon: 'Wrench' },
          { value: 'Housekeeping & cleanliness', label: 'Housekeeping & cleanliness', icon: 'Sparkles' },
          { value: 'Landscaping', label: 'Landscaping', icon: 'TreePine' },
          { value: 'Pest control', label: 'Pest control', icon: 'Bug' },
          { value: 'Paid unit services', label: 'Paid unit services', icon: 'CreditCard' },
          { value: 'Other', label: 'Other', icon: 'MessageCircle' },
        ],
      },
      {
        type: 'textarea',
        number: 12,
        name: 'q12_comment',
        label: 'What else would you like us to know about Facilities Management?',
        required: false,
      },
    ],
  },
  {
    id: 4,
    title: 'Security & Gates',
    subtitle: 'Tell us about your experience with security and access management this season.',
    heroImage: '/img/logo/security-emblem.jpg',
    heroAlt: 'Security and Gates Logo',
    nextLabel: 'Next Section',
    questions: [
      {
        type: 'rating',
        number: 13,
        name: 'q13',
        label: 'How would you rate your overall experience with security and access management this season?',
        required: true,
        options: RATING_OPTIONS,
      },
      {
        type: 'matrix',
        number: 14,
        label: 'How would you rate the following?',
        required: true,
        rows: [
          { name: 'q14_gate', label: 'Main gate experience & access' },
          { name: 'q14_presence', label: 'Security presence within Seashell' },
          { name: 'q14_professionalism', label: 'Security team professionalism & response' },
          { name: 'q14_traffic', label: 'Traffic management' },
          { name: 'q14_parking', label: 'Parking management' },
        ],
      },
      {
        type: 'checkboxGroup',
        number: 15,
        name: 'q15_priorities',
        label: 'Which areas should we prioritise most for Summer 2027?',
        helper: 'Select all that apply',
        required: false,
        options: [
          { value: 'Gate access & entry experience', label: 'Gate access & entry experience', icon: 'DoorOpen' },
          { value: 'Security presence', label: 'Security presence', icon: 'IdCard' },
          { value: 'Security response & enforcement', label: 'Security response & enforcement', icon: 'ShieldAlert' },
          { value: 'Traffic management', label: 'Traffic management', icon: 'Car' },
          { value: 'Parking management', label: 'Parking management', icon: 'SquareParking' },
          { value: 'Other', label: 'Other', icon: 'MessageCircle' },
        ],
      },
      {
        type: 'textarea',
        number: 16,
        name: 'q16_comment',
        label: 'What else would you like us to know about security, gates, traffic or parking?',
        required: false,
      },
    ],
  },
  {
    id: 5,
    title: 'Pools & Lagoons',
    subtitle: 'Tell us about your experience with the pools and lagoons this summer.',
    heroImage: '/img/logo/pool-emblem.jpg',
    heroAlt: 'Pools and Lagoons Logo',
    nextLabel: 'Next Section',
    questions: [
      {
        type: 'rating',
        number: 17,
        name: 'q17',
        label: 'How would you rate your overall experience with the pools and lagoons this summer?',
        required: true,
        options: RATING_OPTIONS,
      },
      {
        type: 'matrix',
        number: 18,
        label: 'How would you rate the following?',
        required: true,
        groups: [
          {
            title: 'Pools',
            icon: 'Waves',
            rows: [
              { name: 'q18_pool_cleanliness', label: 'Pool cleanliness & water quality' },
              { name: 'q18_pool_maint', label: 'Pool maintenance & condition' },
            ],
          },
          {
            title: 'Lagoons',
            icon: 'Droplets',
            rows: [
              { name: 'q18_lagoon_cleanliness', label: 'Lagoon cleanliness & water quality' },
              { name: 'q18_lagoon_maint', label: 'Lagoon maintenance & condition' },
            ],
          },
        ],
      },
      {
        type: 'textarea',
        number: 19,
        name: 'q19_comment',
        label: 'What would you most like us to improve about the pools or lagoons for Summer 2027?',
        required: false,
      },
    ],
  },
  {
    id: 6,
    title: 'Operation Team',
    subtitle: 'Tell us about your experience with our operation team this season.',
    heroImage: '/img/logo/Community-team-emblem.jpg',
    heroAlt: 'Operation Team Logo',
    nextLabel: 'Submit Survey',
    questions: [
      {
        type: 'rating',
        number: 20,
        name: 'q20',
        label: 'How would you rate your overall experience with the operation team this season?',
        required: true,
        options: RATING_OPTIONS,
      },
      {
        type: 'matrix',
        number: 21,
        label: 'How would you rate the following?',
        required: true,
        rows: [
          { name: 'q21_friendliness', label: 'Friendliness & courtesy' },
          { name: 'q21_helpfulness', label: 'Helpfulness & responsiveness' },
          { name: 'q21_professionalism', label: 'Professionalism' },
          { name: 'q21_visibility', label: 'Visibility & availability' },
          { name: 'q21_commitment', label: 'Overall commitment to Seashell' },
        ],
      },
      {
        type: 'checkboxGroup',
        number: 22,
        name: 'q22_priorities',
        label: 'Which areas should we prioritise most for Summer 2027?',
        helper: 'Select all that apply',
        required: false,
        options: [
          { value: 'Friendliness & courtesy', label: 'Friendliness & courtesy', icon: 'Smile' },
          { value: 'Helpfulness & responsiveness', label: 'Helpfulness & responsiveness', icon: 'HandHelping' },
          { value: 'Professionalism', label: 'Professionalism', icon: 'Award' },
          { value: 'Visibility & availability', label: 'Visibility & availability', icon: 'Eye' },
          { value: 'Overall commitment to Seashell', label: 'Overall commitment to Seashell', icon: 'HeartHandshake' },
          { value: 'Other', label: 'Other', icon: 'MessageCircle' },
        ],
      },
      {
        type: 'rating',
        number: 23,
        name: 'q23',
        label: 'For the service you requested this season, how would you rate the response and resolution?',
        required: true,
        options: RATING_OPTIONS,
      },
      {
        type: 'rating',
        number: 24,
        name: 'q24',
        label: 'Overall, how would you rate your Seashell experience this summer?',
        required: true,
        options: RATING_OPTIONS_NO_NA,
      },
    ],
  },
]

export const TOTAL_STEPS = sections.length

// Flattened list of every field name that must be answered before its section can advance,
// derived from each question's `required` flag (mirrors requiredByStep in the original script).
export function requiredFieldsForSection(section) {
  const fields = []
  for (const q of section.questions) {
    if (!q.required) continue
    if (q.type === 'rating') fields.push(q.name)
    if (q.type === 'matrix') {
      const rows = q.groups ? q.groups.flatMap((g) => g.rows) : q.rows
      rows.forEach((row) => fields.push(row.name))
    }
  }
  return fields
}
