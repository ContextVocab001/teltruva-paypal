import type { ProcessingStage } from '../../types/processing'
import './processing.css'

type ProcessingOverlayProps = {
  language: 'en' | 'ja' | 'es'
  isVisible: boolean
  stage: ProcessingStage
}

const stageOrder: ProcessingStage[] = [
  'payment-confirmed',
  'reading-documents',
  'organizing-case',
  'preparing-review',
]

const copy = {
  en: {
    title: 'Preparing your case',
    subtitle: 'This may take a little while. Please keep this page open.',
    stages: {
      'payment-confirmed': 'Payment confirmed',
      'reading-documents': 'Reading your documents',
      'organizing-case': 'Organizing the case details',
      'preparing-review': 'Preparing the review screen',
    },
  },
  ja: {
    title: '案件を準備しています',
    subtitle: '少し時間がかかる場合があります。画面を閉じずにお待ちください。',
    stages: {
      'payment-confirmed': 'お支払いを確認しました',
      'reading-documents': '資料を読み取っています',
      'organizing-case': '案件内容を整理しています',
      'preparing-review': '確認画面を準備しています',
    },
  },
  es: {
    title: 'Preparando tu caso',
    subtitle: 'Este proceso puede tardar un poco. Mantén esta página abierta.',
    stages: {
      'payment-confirmed': 'Pago confirmado',
      'reading-documents': 'Leyendo tus documentos',
      'organizing-case': 'Organizando los detalles del caso',
      'preparing-review': 'Preparando la pantalla de revisión',
    },
  },
} as const

function ProcessingOverlay({
  language,
  isVisible,
  stage,
}: ProcessingOverlayProps) {
  if (!isVisible) return null

  const text = copy[language]
  const activeIndex = stageOrder.indexOf(stage)

  return (
    <div className="processing-overlay" role="status" aria-live="polite">
      <section className="processing-card" aria-label={text.title}>
        <div className="processing-spinner" aria-hidden="true" />
        <h2>{text.title}</h2>
        <p className="processing-subtitle">{text.subtitle}</p>

        <ol className="processing-steps">
          {stageOrder.map((item, index) => {
            const isComplete = index < activeIndex
            const isActive = index === activeIndex

            return (
              <li
                key={item}
                className={
                  isComplete
                    ? 'processing-step processing-step--complete'
                    : isActive
                      ? 'processing-step processing-step--active'
                      : 'processing-step'
                }
              >
                <span className="processing-step__icon" aria-hidden="true">
                  {isComplete ? '✓' : isActive ? '●' : '○'}
                </span>
                <span>{text.stages[item]}</span>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}

export default ProcessingOverlay
