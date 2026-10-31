const CASE_ID_PREFIX = 'TLT'
const DISPLAY_RANDOM_LENGTH = 6
const DISPLAY_RANDOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function createRandomDisplaySegment(length: number): string {
  const randomValues = new Uint32Array(length)
  crypto.getRandomValues(randomValues)

  return Array.from(randomValues, (value) =>
    DISPLAY_RANDOM_ALPHABET.charAt(value % DISPLAY_RANDOM_ALPHABET.length),
  ).join('')
}

export function createInternalCaseId(): string {
  return crypto.randomUUID()
}

export function createDisplayCaseId(date = new Date()): string {
  const year = date.getUTCFullYear()
  const randomSegment = createRandomDisplaySegment(DISPLAY_RANDOM_LENGTH)

  return `${CASE_ID_PREFIX}-${year}-${randomSegment}`
}
