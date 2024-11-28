// Import necessary modules and components
import React from 'react';
import { render, fireEvent, waitFor, queryAllByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoteInput from './index';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocking
fetchMock.enableMocks();

// Describe the NoteInput component test suite
describe('NoteInput Component', () => {
  // Before each test, mock the fetch response
  beforeEach(() => {
    fetchMock.mockResponseOnce(JSON.stringify({
      professional_note: 'Test professional note',
    }));
  });

  // After each test, reset the fetch mock
  afterEach(() => {
    fetchMock.resetMocks();
  });

  /**
   * Test that the form elements are rendered correctly
   * @ai-generated
   */
  it('renders form elements', () => {
    // Render the NoteInput component
    const { getByPlaceholderText, getByText } = render(<NoteInput />);
    
    // Expect the duration input field to be present
    expect(getByPlaceholderText('Duration (minutes)')).toBeInTheDocument();
    // Expect the observations textarea to be present
    expect(getByPlaceholderText('Enter session observations...')).toBeInTheDocument();
    // Expect the Generate Notes button to be present
    expect(getByText('Generate Notes')).toBeInTheDocument();
  });

  /**
   * Test that an error message is displayed when the form is submitted empty
   * @ai-generated
   */
  it('displays error message when form is submitted empty', async () => {
    // Render the NoteInput component
    const { getByText } = render(<NoteInput />);
    
    // Simulate a click on the Generate Notes button
    fireEvent.click(getByText('Generate Notes'));
    
    // Wait for the error message to appear
    await waitFor(() => {
      // Expect the error message to be present
      expect(getByText('All fields required')).toBeInTheDocument();
    });
  });

  /**
   * Test that the form is submitted with valid data
   * @ai-generated
   */
  it('submits form with valid data', async () => {
    // Render the NoteInput component
    const { getByPlaceholderText, getAllByRole, getByText, queryAllByText } = render(<NoteInput />);
    
    // Simulate changes to the form fields
    fireEvent.change(getByPlaceholderText('Duration (minutes)'), { target: { value: '30' } });
    fireEvent.change(getAllByRole('combobox')[0], { target: { value: 'detailed' } });
    fireEvent.change(getAllByRole('combobox')[1], { target: { value: 'initial' } });
    fireEvent.change(getByPlaceholderText('Enter session observations...'), { target: { value: 'Test observation' } });
    
    // Simulate a click on the Generate Notes button
    fireEvent.click(getByText('Generate Notes'));
    
    // Wait for the generated notes to appear
    await waitFor(() => {
      // Expect the generated notes to be present twice
      expect(queryAllByText('Test professional note')).toHaveLength(2);
    });
  });

  /**
   * Test that the generated notes are displayed
   */
  it('displays generated notes', async () => {
    // Render the NoteInput component
    const { getByPlaceholderText, getAllByRole, getByText } = render(<NoteInput />);
    
    // Simulate changes to the form fields
    fireEvent.change(getByPlaceholderText('Duration (minutes)'), { target: { value: '30' } });
    fireEvent.change(getAllByRole('combobox')[0], { target: { value: 'detailed' } });
    fireEvent.change(getAllByRole('combobox')[1], { target: { value: 'initial' } });
    fireEvent.change(getByPlaceholderText('Enter session observations...'), { target: { value: 'Test observation' } });
    
    // Simulate a click on the Generate Notes button
    fireEvent.click(getByText('Generate Notes'));
    
    // Wait for the generated notes to appear
    await waitFor(() => {
      // Expect the Professional Note label to be present
      expect(getByText('Professional Note:')).toBeInTheDocument();
    });
  });
});