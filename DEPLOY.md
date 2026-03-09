# 部署更新指南

## 当前状态

✅ 代码已推送到 GitHub: `heyhuajun/information-board-toolkit`
✅ NAS docker-compose.yml 已更新
✅ 容器正在运行（健康状态：healthy）

## 更新内容

### 安全增强
- 修复导出端点权限漏洞
- 添加 Rate Limiting 中间件
- 加强开发环境认证安全

### 新功能
- `/api/health` 健康检查端点
- 环境变量验证
- 结构化日志系统
- 全局错误处理

### Docker 改进
- 符合 NAS 部署规范
- 非 root 用户运行 (UID 1001)
- OCI 标签
- 日志限制 (10MB × 3)

## 部署步骤

### 方式 1: 拉取最新镜像 (推荐)

```bash
# SSH 到 NAS
ssh huajun@192.168.88.247

# 进入项目目录
cd /volume1/docker/information-board

# 拉取最新镜像并重启
docker compose pull information-board
docker compose up -d information-board

# 查看日志
docker logs -f information-board

# 验证健康状态
docker ps --filter name=information-board
```

### 方式 2: 本地构建

```bash
# SSH 到 NAS
ssh huajun@192.168.88.247

# 进入项目目录
cd /volume1/docker/information-board

# 拉取最新代码
git pull origin main

# 构建并重启
docker compose build information-board
docker compose up -d information-board
```

### 方式 3: 使用 GitHub Actions

推送后，GitHub Actions 自动构建 Docker 镜像并推送到:
- `ghcr.io/heyhuajun/information-board-toolkit:latest`
- `ghcr.io/heyhuajun/information-board-toolkit:<sha>`

## 配置环境变量

创建 `.env` 文件：

```bash
# 在 NAS 上
cd /volume1/docker/information-board
cat > .env << 'EOF'
# API Key (生产环境必需)
API_KEY=$(openssl rand -hex 32)

# 基础 URL
NEXT_PUBLIC_BASE_URL=http://192.168.88.247:3030

# 数据库路径
DATABASE_URL=/app/data/board.db

# 时区
TZ=Asia/Shanghai
EOF

# 生成安全的 API Key
echo "API_KEY=$(openssl rand -hex 32)" >> .env
```

## 验证部署

```bash
# 检查容器状态
docker ps --filter name=information-board --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

# 检查健康状态
docker inspect information-board --format '{{.State.Health.Status}}'

# 测试健康检查端点
curl http://192.168.88.247:3030/api/health

# 测试 API
curl http://192.168.88.247:3030/api/board/list
```

## 回滚

如果出现问题：

```bash
# 回滚到上一个版本
docker compose down information-board
docker compose up -d information-board

# 或回滚到指定版本
docker tag ghcr.io/heyhuajun/information-board-toolkit:latest ghcr.io/heyhuajun/information-board-toolkit:backup
docker compose pull --quiet information-board
docker compose up -d information-board
```

## 规范检查

运行 NAS 上的规范检查脚本：

```bash
/volume1/docker/deployment-standards/docker-check.sh
```

## 检查清单

- [x] 健康检查端点 `/api/health`
- [x] 非 root 用户 (UID 1001)
- [x] OCI 标签
- [x] 日志限制 (10MB × 3)
- [x] 重启策略 `unless-stopped`
- [x] services 网络连接
- [x] 时区配置 `Asia/Shanghai`
- [x] 数据卷挂载 `./data:/app/data`
