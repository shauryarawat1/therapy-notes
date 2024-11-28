import React from 'react';
import { render, fireEvent, waitFor, queryAllByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoteInput from './index';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('NoteInput Component', () => {
  beforeEach(() => {
    fetchMock.mockResponseOnce(JSON.stringify({
      professional_note: 'Test professional note',
    }));
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('renders form elements', () => {
    const { getByPlaceholderText, getByText } = render(<NoteInput />);
    
    expect(getByPlaceholderText('Duration (minutes)')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter session observations...')).toBeInTheDocument();
    expect(getByText('Generate Notes')).toBeInTheDocument();
  });

  it('displays error message when form is submitted empty', async () => {
    const { getByText } = render(<NoteInput />);
    
    fireEvent.click(getByText('Generate Notes'));
    
    await waitFor(() => {
      expect(getByText('All fields required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const { getByPlaceholderText, getAllByRole, getByText, queryAllByText } = render(<NoteInput />);
    
    fireEvent.change(getByPlaceholderText('Duration (minutes)'), { target: { value: '30' } });
    fireEvent.change(getAllByRole('combobox')[0], { target: { value: 'detailed' } });
    fireEvent.change(getAllByRole('combobox')[1], { target: { value: 'initial' } });
    fireEvent.change(getByPlaceholderText('Enter session observations...'), { target: { value: 'Test observation' } });
    
    fireEvent.click(getByText('Generate Notes'));
    
    await waitFor(() => {
      expect(queryAllByText('Test professional note')).toHaveLength(2);
    });
  });

  it('displays generated notes', async () => {
    const { getByPlaceholderText, getAllByRole, getByText } = render(<NoteInput />);
    
    fireEvent.change(getByPlaceholderText('Duration (minutes)'), { target: { value: '30' } });
    fireEvent.change(getAllByRole('combobox')[0], { target: { value: 'detailed' } });
    fireEvent.change(getAllByRole('combobox')[1], { target: { value: 'initial' } });
    fireEvent.change(getByPlaceholderText('Enter session observations...'), { target: { value: 'Test observation' } });
    
    fireEvent.click(getByText('Generate Notes'));
    
    await waitFor(() => {
      expect(getByText('Professional Note:')).toBeInTheDocument();
    });
  });
});