import { getDashboardByRole, getRolLabel } from '@/lib/utils'

describe('getDashboardByRole', () => {
  it('returns /admin for TEACHER_PLATFORM', () => {
    expect(getDashboardByRole('TEACHER_PLATFORM')).toBe('/admin')
  })

  it('returns /dashboard/docente-colegio for TEACHER_SCHOOL', () => {
    expect(getDashboardByRole('TEACHER_SCHOOL')).toBe('/dashboard/docente-colegio')
  })

  it('returns /dashboard/acudiente for GUARDIAN', () => {
    expect(getDashboardByRole('GUARDIAN')).toBe('/dashboard/acudiente')
  })

  it('returns /dashboard as fallback for unknown roles', () => {
    expect(getDashboardByRole('UNKNOWN')).toBe('/dashboard')
  })
})

describe('getRolLabel', () => {
  it('returns correct label for TEACHER_PLATFORM', () => {
    expect(getRolLabel('TEACHER_PLATFORM')).toBe('Docente Plataforma')
  })

  it('returns correct label for TEACHER_SCHOOL', () => {
    expect(getRolLabel('TEACHER_SCHOOL')).toBe('Docente Colegio')
  })

  it('returns correct label for GUARDIAN', () => {
    expect(getRolLabel('GUARDIAN')).toBe('Acudiente')
  })

  it('returns the raw role for unknown values', () => {
    expect(getRolLabel('UNKNOWN_ROLE')).toBe('UNKNOWN_ROLE')
  })
})

describe('Authorization logic', () => {
  it('should identify valid roles', () => {
    const validRoles = ['TEACHER_PLATFORM', 'TEACHER_SCHOOL', 'GUARDIAN']
    validRoles.forEach((role) => {
      expect(getDashboardByRole(role)).not.toBe('/dashboard')
    })
  })

  it('should reject empty role', () => {
    expect(getDashboardByRole('')).toBe('/dashboard')
  })
})
