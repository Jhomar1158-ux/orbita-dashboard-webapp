// Import the production test data
import prodTestsData from './prod-tests-questions.json';

// Define the test interface based on our application needs
export interface TestOption {
  label: string;
  score?: number | string; // Allow both number and string scores
}

export interface TestQuestion {
  id: number;
  text: string;
  dimension?: string;
  options: TestOption[];
}

export interface Test {
  id: number;
  name: string;
  description: string;
  route: string;
  code?: string;
  dimensions?: string[];
  questions: TestQuestion[];
  // Colors for the planets in the solar system
  color?: string;
  // Speed and size for animation
  speed?: number;
  size?: number;
  // Estimated time to complete the test
  estimatedTime?: string;
}

// Map the tests with additional UI properties
const planetColors = ["#7be495", "#4f8cff", "#ffb347", "#ff6f69", "#a580ff", "#67dfe0"];

// Create type to match the imported JSON structure
type ImportedTest = {
  id: number;
  name: string;
  description: string;
  route: string;
  code?: string;
  dimensions?: string[];
  questions: {
    id: number;
    text: string;
    dimension?: string;
    options: {
      label: string;
      score: number | string;
    }[];
  }[];
};

// Process the imported tests
export const testsData: Test[] = (prodTestsData.tests as ImportedTest[]).map((test, index) => ({
  ...test,
  // Ensure the route follows our app format
  route: test.route.replace('/test/', ''),
  // Add UI properties
  color: planetColors[index % planetColors.length],
  speed: 0.05 + Math.random() * 0.05,
  size: 80 + (index % 3) * 12,
  // Estimated time to complete
  estimatedTime: '15-20 min'
}));

export default testsData; 