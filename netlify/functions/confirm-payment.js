

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const { paymentKey, orderId, amount } = JSON.parse(event.body);

    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      console.error('TOSS_SECRET_KEY is missing');
      return {
        statusCode: 500,
        body: JSON.stringify({
          code: 'MISSING_TOSS_SECRET_KEY',
          message: 'Netlify 환경변수 TOSS_SECRET_KEY가 설정되지 않았습니다.'
        })
      };
    }

    console.log('Confirm request received', { orderId, amount });

    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Toss confirm failed', {
        status: response.status,
        code: result.code,
        message: result.message,
        orderId,
        amount
      });
    } else {
      console.log('Toss confirm succeeded', {
        status: response.status,
        orderId,
        amount
      });
    }

    return {
      statusCode: response.status,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message
      })
    };
  }
};