interface Env {
    bgdb: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { env, data, request } = context;
        
        // 解析请求体
        const body = await request.json();
        const { nickname } = body;

        // 验证昵称
        if (!nickname || typeof nickname !== 'string' || nickname.length > 32) {
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    message: '昵称格式不正确' 
                }), 
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // 更新数据库中的昵称
        const db = env.bgdb;
        const result = await db.prepare(`
            UPDATE users 
            SET nickname = ?, 
                updated_at = DATETIME('now')
            WHERE id = ?
        `).bind(nickname, data.user.userId).run();

        if (!result.success) {
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    message: '更新失败' 
                }), 
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // 获取更新后的用户信息
        const userInfo = await db.prepare(`
            SELECT id, phone, nickname, avatar_url, status
            FROM users 
            WHERE id = ?
        `).bind(data.user.userId).first();

        return new Response(
            JSON.stringify({ 
                success: true, 
                data: userInfo 
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