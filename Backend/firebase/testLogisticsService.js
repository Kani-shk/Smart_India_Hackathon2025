// Test script for logistics service
// Run this to test the logistics service functionality

import { 
  addLogistics, 
  getLogistics, 
  getLogisticsNearby, 
  calculateDistance,
  searchLogistics 
} from './logisticsService';

// Test data
const testLogistics = {
  name: "Test Logistics Center",
  type: "Test Center",
  address: "Test Address, Test City",
  latitude: 28.6139,
  longitude: 77.2090,
  capacity: "1000 meals/day",
  contact: "+91-9999999999",
  status: "active"
};

// Test functions
const testAddLogistics = async () => {
  try {
    console.log('Testing addLogistics...');
    const result = await addLogistics(testLogistics);
    console.log('✅ addLogistics successful:', result);
    return result.id;
  } catch (error) {
    console.error('❌ addLogistics failed:', error);
    return null;
  }
};

const testGetLogistics = async () => {
  try {
    console.log('Testing getLogistics...');
    const result = await getLogistics();
    console.log('✅ getLogistics successful:', result.length, 'items');
    return result;
  } catch (error) {
    console.error('❌ getLogistics failed:', error);
    return [];
  }
};

const testGetLogisticsNearby = async () => {
  try {
    console.log('Testing getLogisticsNearby...');
    const result = await getLogisticsNearby(28.6139, 77.2090, 50);
    console.log('✅ getLogisticsNearby successful:', result.length, 'nearby items');
    return result;
  } catch (error) {
    console.error('❌ getLogisticsNearby failed:', error);
    return [];
  }
};

const testCalculateDistance = () => {
  try {
    console.log('Testing calculateDistance...');
    const distance = calculateDistance(28.6139, 77.2090, 19.0760, 72.8777);
    console.log('✅ calculateDistance successful:', distance.toFixed(2), 'km');
    return distance;
  } catch (error) {
    console.error('❌ calculateDistance failed:', error);
    return 0;
  }
};

const testSearchLogistics = async () => {
  try {
    console.log('Testing searchLogistics...');
    const result = await searchLogistics('Test');
    console.log('✅ searchLogistics successful:', result.length, 'search results');
    return result;
  } catch (error) {
    console.error('❌ searchLogistics failed:', error);
    return [];
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting logistics service tests...\n');
  
  // Test distance calculation first (no async)
  testCalculateDistance();
  
  // Test async functions
  const addedId = await testAddLogistics();
  await testGetLogistics();
  await testGetLogisticsNearby();
  await testSearchLogistics();
  
  console.log('\n✅ All tests completed!');
};

// Export for use in other files
export { 
  testAddLogistics, 
  testGetLogistics, 
  testGetLogisticsNearby, 
  testCalculateDistance, 
  testSearchLogistics,
  runAllTests 
};

// Uncomment to run tests immediately
// runAllTests();
