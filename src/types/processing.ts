export type ProcessingStage =
  | 'payment-confirmed'
  | 'reading-documents'
  | 'organizing-case'
  | 'preparing-review'

export type ProcessingOverlayState = {
  isVisible: boolean
  stage: ProcessingStage
}
