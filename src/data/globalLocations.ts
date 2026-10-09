export interface GlobalLocation {
  city: string;
  code: string;
  country: string;
  region: 'Asia' | 'Middle East' | 'Europe' | 'North America' | 'Latin America' | 'Africa' | 'Oceania';
}

export const WORLD_LOCATIONS: GlobalLocation[] = [
  // --- Asia ---
  { city: 'Mumbai', code: 'BOM', country: 'India', region: 'Asia' },
  { city: 'Delhi', code: 'DEL', country: 'India', region: 'Asia' },
  { city: 'Chennai', code: 'MAA', country: 'India', region: 'Asia' },
  { city: 'Bangalore', code: 'BLR', country: 'India', region: 'Asia' },
  { city: 'Shanghai', code: 'PVG', country: 'China', region: 'Asia' },
  { city: 'Shenzhen', code: 'SZX', country: 'China', region: 'Asia' },
  { city: 'Beijing', code: 'PEK', country: 'China', region: 'Asia' },
  { city: 'Hong Kong', code: 'HKG', country: 'Hong Kong', region: 'Asia' },
  { city: 'Tokyo', code: 'NRT', country: 'Japan', region: 'Asia' },
  { city: 'Osaka', code: 'KIX', country: 'Japan', region: 'Asia' },
  { city: 'Seoul', code: 'ICN', country: 'South Korea', region: 'Asia' },
  { city: 'Singapore', code: 'SIN', country: 'Singapore', region: 'Asia' },
  { city: 'Bangkok', code: 'BKK', country: 'Thailand', region: 'Asia' },
  { city: 'Kuala Lumpur', code: 'KUL', country: 'Malaysia', region: 'Asia' },
  { city: 'Jakarta', code: 'CGK', country: 'Indonesia', region: 'Asia' },
  { city: 'Manila', code: 'MNL', country: 'Philippines', region: 'Asia' },
  { city: 'Taipei', code: 'TPE', country: 'Taiwan', region: 'Asia' },
  { city: 'Ho Chi Minh City', code: 'SGN', country: 'Vietnam', region: 'Asia' },
  { city: 'Hanoi', code: 'HAN', country: 'Vietnam', region: 'Asia' },
  { city: 'Karachi', code: 'KHI', country: 'Pakistan', region: 'Asia' },
  { city: 'Colombo', code: 'CMB', country: 'Sri Lanka', region: 'Asia' },
  { city: 'Dhaka', code: 'DAC', country: 'Bangladesh', region: 'Asia' },

  // --- Middle East ---
  { city: 'Jeddah', code: 'JED', country: 'Saudi Arabia', region: 'Middle East' },
  { city: 'Riyadh', code: 'RUH', country: 'Saudi Arabia', region: 'Middle East' },
  { city: 'Dammam', code: 'DMM', country: 'Saudi Arabia', region: 'Middle East' },
  { city: 'Dubai', code: 'DXB', country: 'United Arab Emirates', region: 'Middle East' },
  { city: 'Abu Dhabi', code: 'AUH', country: 'United Arab Emirates', region: 'Middle East' },
  { city: 'Doha', code: 'DOH', country: 'Qatar', region: 'Middle East' },
  { city: 'Kuwait City', code: 'KWI', country: 'Kuwait', region: 'Middle East' },
  { city: 'Muscat', code: 'MCT', country: 'Oman', region: 'Middle East' },
  { city: 'Manama', code: 'BAH', country: 'Bahrain', region: 'Middle East' },
  { city: 'Istanbul', code: 'IST', country: 'Turkey', region: 'Middle East' },

  // --- Europe ---
  { city: 'London', code: 'LHR', country: 'United Kingdom', region: 'Europe' },
  { city: 'Manchester', code: 'MAN', country: 'United Kingdom', region: 'Europe' },
  { city: 'Frankfurt', code: 'FRA', country: 'Germany', region: 'Europe' },
  { city: 'Hamburg', code: 'HAM', country: 'Germany', region: 'Europe' },
  { city: 'Amsterdam', code: 'AMS', country: 'Netherlands', region: 'Europe' },
  { city: 'Rotterdam', code: 'RTM', country: 'Netherlands', region: 'Europe' },
  { city: 'Paris', code: 'CDG', country: 'France', region: 'Europe' },
  { city: 'Antwerp', code: 'ANR', country: 'Belgium', region: 'Europe' },
  { city: 'Brussels', code: 'BRU', country: 'Belgium', region: 'Europe' },
  { city: 'Madrid', code: 'MAD', country: 'Spain', region: 'Europe' },
  { city: 'Barcelona', code: 'BCN', country: 'Spain', region: 'Europe' },
  { city: 'Milan', code: 'MXP', country: 'Italy', region: 'Europe' },
  { city: 'Rome', code: 'FCO', country: 'Italy', region: 'Europe' },
  { city: 'Zurich', code: 'ZRH', country: 'Switzerland', region: 'Europe' },
  { city: 'Vienna', code: 'VIE', country: 'Austria', region: 'Europe' },
  { city: 'Warsaw', code: 'WAW', country: 'Poland', region: 'Europe' },
  { city: 'Copenhagen', code: 'CPH', country: 'Denmark', region: 'Europe' },
  { city: 'Dublin', code: 'DUB', country: 'Ireland', region: 'Europe' },
  { city: 'Stockholm', code: 'ARN', country: 'Sweden', region: 'Europe' },
  { city: 'Oslo', code: 'OSL', country: 'Norway', region: 'Europe' },
  { city: 'Helsinki', code: 'HEL', country: 'Finland', region: 'Europe' },
  { city: 'Athens', code: 'ATH', country: 'Greece', region: 'Europe' },

  // --- North America ---
  { city: 'New York', code: 'JFK', country: 'United States', region: 'North America' },
  { city: 'Los Angeles', code: 'LAX', country: 'United States', region: 'North America' },
  { city: 'Chicago', code: 'ORD', country: 'United States', region: 'North America' },
  { city: 'Miami', code: 'MIA', country: 'United States', region: 'North America' },
  { city: 'Atlanta', code: 'ATL', country: 'United States', region: 'North America' },
  { city: 'Seattle', code: 'SEA', country: 'United States', region: 'North America' },
  { city: 'Houston', code: 'IAH', country: 'United States', region: 'North America' },
  { city: 'Dallas', code: 'DFW', country: 'United States', region: 'North America' },
  { city: 'San Francisco', code: 'SFO', country: 'United States', region: 'North America' },
  { city: 'Toronto', code: 'YYZ', country: 'Canada', region: 'North America' },
  { city: 'Vancouver', code: 'YVR', country: 'Canada', region: 'North America' },
  { city: 'Montreal', code: 'YUL', country: 'Canada', region: 'North America' },
  { city: 'Mexico City', code: 'MEX', country: 'Mexico', region: 'North America' },
  { city: 'Guadalajara', code: 'GDL', country: 'Mexico', region: 'North America' },

  // --- Latin America ---
  { city: 'São Paulo', code: 'GRU', country: 'Brazil', region: 'Latin America' },
  { city: 'Rio de Janeiro', code: 'GIG', country: 'Brazil', region: 'Latin America' },
  { city: 'Santos', code: 'SSZ', country: 'Brazil', region: 'Latin America' },
  { city: 'Buenos Aires', code: 'EZE', country: 'Argentina', region: 'Latin America' },
  { city: 'Santiago', code: 'SCL', country: 'Chile', region: 'Latin America' },
  { city: 'Bogota', code: 'BOG', country: 'Colombia', region: 'Latin America' },
  { city: 'Lima', code: 'LIM', country: 'Peru', region: 'Latin America' },
  { city: 'Panama City', code: 'PTY', country: 'Panama', region: 'Latin America' },

  // --- Africa ---
  { city: 'Cairo', code: 'CAI', country: 'Egypt', region: 'Africa' },
  { city: 'Alexandria', code: 'ALY', country: 'Egypt', region: 'Africa' },
  { city: 'Johannesburg', code: 'JNB', country: 'South Africa', region: 'Africa' },
  { city: 'Cape Town', code: 'CPT', country: 'South Africa', region: 'Africa' },
  { city: 'Durban', code: 'DUR', country: 'South Africa', region: 'Africa' },
  { city: 'Nairobi', code: 'NBO', country: 'Kenya', region: 'Africa' },
  { city: 'Lagos', code: 'LOS', country: 'Nigeria', region: 'Africa' },
  { city: 'Casablanca', code: 'CMN', country: 'Morocco', region: 'Africa' },
  { city: 'Addis Ababa', code: 'ADD', country: 'Ethiopia', region: 'Africa' },
  { city: 'Accra', code: 'ACC', country: 'Ghana', region: 'Africa' },

  // --- Oceania ---
  { city: 'Sydney', code: 'SYD', country: 'Australia', region: 'Oceania' },
  { city: 'Melbourne', code: 'MEL', country: 'Australia', region: 'Oceania' },
  { city: 'Brisbane', code: 'BNE', country: 'Australia', region: 'Oceania' },
  { city: 'Perth', code: 'PER', country: 'Australia', region: 'Oceania' },
  { city: 'Auckland', code: 'AKL', country: 'New Zealand', region: 'Oceania' },
];

export const REGIONS_LIST = [
  'All Regions',
  'Asia',
  'Middle East',
  'Europe',
  'North America',
  'Latin America',
  'Africa',
  'Oceania',
] as const;
