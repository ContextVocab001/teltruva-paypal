import { INITIAL_CASE_PRODUCT } from '../../config/products';

type PaymentSummaryProps = {
  language: 'en' | 'ja' | 'es';
};

const copy = {
  en: {
    eyebrow: 'One-time case support',
    title: 'Review what is included',
    initialMessage: 'One initial inquiry message',
    followUps: 'Two follow-up responses',
    revisions: 'One pre-send revision per message',
    savedAccess: 'Unlimited access to saved documents',
    noSubscription: 'No subscription or automatic renewal',
    total: 'Total',
    sandbox: 'Sandbox test payment. No real money will be charged.',
  },
  ja: {
    eyebrow: '案件ごとの買い切りサポート',
    title: '料金に含まれる内容',
    initialMessage: '最初の問い合わせ文 1回',
    followUps: '相手からの返信対応 2回',
    revisions: '各メッセージの送信前修正 1回',
    savedAccess: '保存済み文書の閲覧は無制限',
    noSubscription: '定期購入・自動更新なし',
    total: '合計',
    sandbox: 'Sandboxのテスト決済です。実際の料金は発生しません。',
  },
  es: {
    eyebrow: 'Soporte de caso con pago único',
    title: 'Revisa lo que está incluido',
    initialMessage: 'Un mensaje de consulta inicial',
    followUps: 'Dos respuestas de seguimiento',
    revisions: 'Una revisión antes del envío por mensaje',
    savedAccess: 'Acceso ilimitado a los documentos guardados',
    noSubscription: 'Sin suscripción ni renovación automática',
    total: 'Total',
    sandbox: 'Pago de prueba en Sandbox. No se cobrará dinero real.',
  },
} as const;

function PaymentSummary({ language }: PaymentSummaryProps) {
  const text = copy[language];
  const product = INITIAL_CASE_PRODUCT;

  return (
    <section
      className="payment-summary"
      aria-labelledby="payment-summary-title"
    >
      <div className="payment-summary__heading">
        <p className="payment-summary__eyebrow">{text.eyebrow}</p>
        <h2 id="payment-summary-title">{text.title}</h2>
      </div>

      <ul className="payment-summary__features">
        <li>{text.initialMessage}</li>
        <li>{text.followUps}</li>
        <li>{text.revisions}</li>
        <li>{text.savedAccess}</li>
        <li>{text.noSubscription}</li>
      </ul>

      <div className="payment-summary__total">
        <span>{text.total}</span>
        <strong>
          {product.currency} {product.amount}
        </strong>
      </div>

      <p className="payment-summary__sandbox-note">{text.sandbox}</p>
    </section>
  );
}

export default PaymentSummary;
