import { formatDate, getTodayString, addDaysToDate, getDaysDifference } from '@/lib/utils/dateUtils';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly for Indian locale', () => {
      // Mock date to ensure consistent testing
      const mockDate = '2024-01-15T10:30:00Z';
      const formatted = formatDate(mockDate);
      expect(formatted).toMatch(/Mon, Jan 15|Mon, 15 Jan/); // Different Node.js versions may format differently
    });

    it('should handle different date formats', () => {
      const date1 = '2024-01-01';
      const date2 = '2024-12-31T23:59:59Z';

      expect(() => formatDate(date1)).not.toThrow();
      expect(() => formatDate(date2)).not.toThrow();
    });

    it('should handle invalid date gracefully', () => {
      // The function doesn't throw, it handles invalid dates
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('getTodayString', () => {
    it('should return today\'s date in YYYY-MM-DD format', () => {
      const today = getTodayString();
      const todayRegex = /^\d{4}-\d{2}-\d{2}$/;
      expect(today).toMatch(todayRegex);

      // Verify it's actually today's date
      const expected = new Date().toISOString().split('T')[0];
      expect(today).toBe(expected);
    });

    it('should return consistent format', () => {
      const result1 = getTodayString();
      // Small delay to ensure different milliseconds
      setTimeout(() => {
        const result2 = getTodayString();
        expect(result1).toBe(result2);
      }, 10);
    });
  });

  describe('addDaysToDate', () => {
    it('should add positive days correctly', () => {
      const result = addDaysToDate('2024-01-15', 5);
      expect(result).toBe('2024-01-20');
    });

    it('should subtract days when negative number is provided', () => {
      const result = addDaysToDate('2024-01-15', -3);
      expect(result).toBe('2024-01-12');
    });

    it('should handle zero days', () => {
      const result = addDaysToDate('2024-01-15', 0);
      expect(result).toBe('2024-01-15');
    });

    it('should handle month boundaries correctly', () => {
      const result = addDaysToDate('2024-01-31', 1);
      expect(result).toBe('2024-02-01');
    });

    it('should handle year boundaries correctly', () => {
      const result = addDaysToDate('2023-12-31', 1);
      expect(result).toBe('2024-01-01');
    });

    it('should handle leap years correctly', () => {
      // 2024 is a leap year
      const result = addDaysToDate('2024-02-28', 1);
      expect(result).toBe('2024-02-29');
    });

    it('should handle non-leap years correctly', () => {
      // 2023 is not a leap year
      const result = addDaysToDate('2023-02-28', 1);
      expect(result).toBe('2023-03-01');
    });
  });

  describe('getDaysDifference', () => {
    it('should calculate positive difference correctly', () => {
      const diff = getDaysDifference('2024-01-01', '2024-01-05');
      expect(diff).toBe(4);
    });

    it('should calculate difference regardless of order', () => {
      const diff1 = getDaysDifference('2024-01-01', '2024-01-05');
      const diff2 = getDaysDifference('2024-01-05', '2024-01-01');
      expect(diff1).toBe(diff2);
    });

    it('should return 0 for same dates', () => {
      const diff = getDaysDifference('2024-01-15', '2024-01-15');
      expect(diff).toBe(0);
    });

    it('should handle month boundaries', () => {
      const diff = getDaysDifference('2024-01-30', '2024-02-02');
      expect(diff).toBe(3);
    });

    it('should handle year boundaries', () => {
      const diff = getDaysDifference('2023-12-30', '2024-01-02');
      expect(diff).toBe(3);
    });

    it('should handle leap years', () => {
      const diff = getDaysDifference('2024-02-28', '2024-03-01');
      expect(diff).toBe(2); // Feb 28 to Mar 1 is 2 days (including Feb 29)
    });

    it('should handle large date differences', () => {
      const diff = getDaysDifference('2020-01-01', '2024-01-01');
      expect(diff).toBe(1461); // 4 years including leap year
    });
  });
});
