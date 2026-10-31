import { INITIAL_CASE_PRODUCT } from '../config/products'
import type { CreateCaseInput, TeltruvaCase } from '../types/case'
import { createDisplayCaseId, createInternalCaseId } from './caseId'

const CASE_SESSION_KEY = 'teltruva.current-case'

function calculateRemainingFollowUps(caseData: TeltruvaCase): number {
  return Math.max(
    0,
    caseData.includedFollowUps +
      caseData.purchasedAdditionalFollowUps -
      caseData.usedFollowUps -
      caseData.reservedFollowUps,
  )
}

function isStoredCase(value: unknown): value is TeltruvaCase {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<TeltruvaCase>

  return (
    typeof candidate.internalId === 'string' &&
    typeof candidate.displayCaseId === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string'
  )
}

export function createCase(input: CreateCaseInput): TeltruvaCase {
  const now = new Date().toISOString()
  const includedFollowUps = INITIAL_CASE_PRODUCT.includedFollowUps

  return {
    internalId: createInternalCaseId(),
    displayCaseId: createDisplayCaseId(),
    ownerUserId: null,
    status: 'DRAFT',
    interfaceLanguage: input.interfaceLanguage,
    recipientLanguage: input.recipientLanguage,
    issueSummary: input.issueSummary?.trim() || '',
    requestedOutcome: input.requestedOutcome?.trim() || '',
    paymentStatus: 'NOT_STARTED',
    aiStatus: 'NOT_STARTED',
    includedFollowUps,
    purchasedAdditionalFollowUps: 0,
    usedFollowUps: 0,
    reservedFollowUps: 0,
    remainingFollowUps: includedFollowUps,
    createdAt: now,
    updatedAt: now,
  }
}

export function saveCurrentCase(caseData: TeltruvaCase): TeltruvaCase {
  const updatedCase = {
    ...caseData,
    remainingFollowUps: calculateRemainingFollowUps(caseData),
    updatedAt: new Date().toISOString(),
  }

  window.sessionStorage.setItem(CASE_SESSION_KEY, JSON.stringify(updatedCase))
  return updatedCase
}

export function loadCurrentCase(): TeltruvaCase | null {
  try {
    const stored = window.sessionStorage.getItem(CASE_SESSION_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored) as unknown
    if (!isStoredCase(parsed)) {
      clearCurrentCase()
      return null
    }

    return {
      ...parsed,
      remainingFollowUps: calculateRemainingFollowUps(parsed),
    }
  } catch {
    clearCurrentCase()
    return null
  }
}

export function clearCurrentCase(): void {
  window.sessionStorage.removeItem(CASE_SESSION_KEY)
}
