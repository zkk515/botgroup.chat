interface Env {
    JWT_SECRET: string;
}

export async function verifyToken(token: string, env: Env) {
    try {
        const [headerB64, payloadB64, signature] = token.split('.');
        
        // 验证签名
        const input = `${headerB64}.${payloadB64}`;
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(env.JWT_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );
        
        const signatureBytes = Uint8Array.from(atob(
            signature.replace(/-/g, '+').replace(/_/g, '/')
        ), c => c.charCodeAt(0));
        
        const isValid = await crypto.subtle.verify(
            'HMAC',
            key,
            signatureBytes,
            encoder.encode(input)
        );
        
        if (!isValid) {
            throw new Error('Invalid signature');
        }
        
        // 解码 payload
        const payload = JSON.parse(atob(
            payloadB64.replace(/-/g, '+').replace(/_/g, '/')
        ));
        
        // 检查过期时间
        if (payload.exp < Math.floor(Date.now() / 1000)) {
            throw new Error('Token expired');
        }
        
        return payload;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

// 中间件函数
export const authMiddleware = async (request: Request, env: Env) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    return await verifyToken(token, env);
}; 