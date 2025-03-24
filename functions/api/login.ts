interface Env {
    bgkv: KVNamespace;
    JWT_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        
        // 获取请求体
        const body = await request.json();
        const { phone, code } = body;

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

        // 验证码格式检查
        if (!code || !/^\d{6}$/.test(code)) {
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    message: '验证码格式错误' 
                }), 
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // 从 KV 中获取存储的验证码
        const storedCode = await env.bgkv.get(`sms:${phone}`);
        
        if (!storedCode || storedCode !== code) {
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    message: '验证码错误或已过期' 
                }), 
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // 验证成功，生成 JWT token，传入 env
        const token = await generateToken(phone, env);
        
        // 删除验证码
        await env.bgkv.delete(`sms:${phone}`);

        return new Response(
            JSON.stringify({ 
                success: true, 
                message: '登录成功',
                data: {
                    token,
                    phone
                }
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

// 修改为 async 函数
async function generateToken(phone: string, env: Env): Promise<string> {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    
    const payload = {
        phone,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7天过期
        iat: Math.floor(Date.now() / 1000)
    };
    
    // Base64Url 编码
    const encodeBase64Url = (data: object) => {
        return btoa(JSON.stringify(data))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    };
    
    // 生成签名
    const generateSignature = async (input: string, secret: string) => {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign(
            'HMAC',
            key,
            encoder.encode(input)
        );
        
        return btoa(String.fromCharCode(...new Uint8Array(signature)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    };
    
    const headerEncoded = encodeBase64Url(header);
    const payloadEncoded = encodeBase64Url(payload);
    
    const signature = await generateSignature(
        `${headerEncoded}.${payloadEncoded}`,
        env.JWT_SECRET
    );
    
    return `${headerEncoded}.${payloadEncoded}.${signature}`;
} 