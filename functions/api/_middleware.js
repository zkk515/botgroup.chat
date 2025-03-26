async function verifyToken(token, env) {
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
export async function onRequest(context) {
    try {
        //获取环境变量中的AUTH_ACCESS
        const authAccess = context.env.AUTH_ACCESS;
        console.log('authAccess', authAccess);
        //如果AUTH_ACCESS为0则跳过权限校验
        if (!authAccess || authAccess === '0') {
            console.log('跳过权限校验');
            return await context.next();
        }
        const request = context.request;
        const env = context.env;
        //跳过登录页面
        if (request.url.includes('/login') || request.url.includes('/sendcode') || request.url.includes('/login') || request.url.includes('/test-db')) {
            return await context.next();
        }
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('No token provided');
        }
        
        const token = authHeader.split(' ')[1];
        const payload = await verifyToken(token, env);
        
        // 将用户信息添加到上下文中
        context.user = payload;
        
        return await context.next();
    } catch (error) {
        console.error(error.message, context.request.url);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
