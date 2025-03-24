interface Env {
    bgkv: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    
    // 获取请求体
    const body = await request.json();
    const { phone } = body;

    // 验证手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: '无效的手机号码' 
        }), 
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // 生成6位随机验证码
    let verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // 使用 CF_PAGES_ENVIRONMENT 判断环境
    // 值为 'production' 或 'preview'
    if (env.CF_PAGES_ENVIRONMENT !== 'production') {
        verificationCode = '123456';
    }
    // 将验证码存储到 KV 中，设置5分钟过期
    await env.bgkv.put(`sms:${phone}`, verificationCode, {
      expirationTtl: 300 // 5分钟过期
    });
    console.log(env.CF_PAGES_ENVIRONMENT, await env.bgkv.get(`sms:${phone}`));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '验证码发送成功',
        // 注意：实际生产环境不应该返回验证码
        code: verificationCode  // 仅用于测试
      }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: '服务器错误' 
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
