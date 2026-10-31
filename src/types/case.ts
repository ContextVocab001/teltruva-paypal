export type CaseStatus =
  | 'DRAFT'
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_CANCELLED'
  | 'PAID'
  | 'PROCESSING'
  | 'ACTIVE'
  | 'RESOLVED'
  | 'CLOSED'

export type CasePaymentStatus =
  | 'NOT_STARTED'
  | 'CREATED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'

export type CaseAiStatus =
  | 'NOT_STARTED'
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED_RETRYABLE'
  | 'FAILED_FINAL'

export type CaseLanguage = 'en' | 'ja' | 'es'

export type TeltruvaCase = {
  internalId: string
  displayCaseId: string
  ownerUserId: string | null
  status: CaseStatus
  interfaceLanguage: CaseLanguage
  recipientLanguage: CaseLanguage
  issueSummary: string
  requestedOutcome: string
  paymentStatus: CasePaymentStatus
  aiStatus: CaseAiStatus
  includedFollowUps: number
  purchasedAdditionalFollowUps: number
  usedFollowUps: number
  reservedFollowUps: number
  remainingFollowUps: number
  createdAt: string
  updatedAt: string
}

export type CreateCaseInput = {
  interfaceLanguage: CaseLanguage
  recipientLanguage: CaseLanguage
  issueSummary?: string
  requestedOutcome?: string
}
