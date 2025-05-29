# 猜灯谜拼图游戏 API 文档

## 基础信息
- 基础URL: `http://103.94.185.53:8017/`
- 所有请求使用JSON格式
- 默认请求头: `Content-Type: application/json`

## 认证机制
- 使用Cookie认证
- Cookie名称: `cdm_id`
- Cookie会在首次访问时自动创建，有效期7天

## API 端点

### 1. 用户相关 API

#### 1.1 获取随机信息（预注册）
```
GET /api/users/random-info
```

**描述**: 为新用户生成随机信息并创建游客账号

**响应示例**:
```json
{
    "status": "success",
    "user": {
        "id": 123,
        "name": "游客_abc123"
    }
}
```

#### 1.2 获取用户信息
```
GET /api/users/user-info
```

**描述**: 获取当前用户的详细信息

**响应示例**:
```json
{
    "status": "success",
    "user": {
        "id": 123,
        "name": "用户名",
        "avatar": "avatar/path.jpg",
        "avatar_url": "临时签名的头像URL",
        "is_active": true,
        "pieces": [1, 2, 3],
        "correct": 10,
        "accuracy": 85.5
    }
}
```

#### 1.3 更新用户信息
```
PATCH /api/users/update
```

**描述**: 更新用户的名称和头像

**请求格式**: `multipart/form-data`

**参数**:
- `name`: (可选) 字符串，新的用户名
- `avatar`: (可选) 文件，新的头像图片

**响应示例**:
```json
{
    "status": "success",
    "user": {
        "id": 123,
        "name": "新用户名",
        "avatar_url": "新的头像URL",
        "is_active": true
    }
}
```

### 2. 竞速模式 API

#### 2.1 获取竞速模式题目
```
GET /api/riddles/speed-mode/questions
```

**描述**: 获取60个随机灯谜题目

**响应示例**:
```json
{
    "status": "success",
    "questions": [
        {
            "id": 1,
            "title": "谜面内容",
            "hint": "谜底类型提示"
        }
        // ... 共60个题目
    ]
}
```



### 2. 竞速模式 API

#### 2.1 获取竞速模式题目
```
GET /api/riddles/speed-mode/questions
```

**描述**: 获取60个随机灯谜题目

**响应示例**:
```json
{
    "status": "success",
    "questions": [
        {
            "id": 1,
            "title": "谜面内容",
            "hint": "谜底类型提示"
        }
        // ... 共60个题目
    ]
}
```

#### 2.2 提交单个答案
```
POST /api/riddles/speed-mode/submit-single
```

**描述**: 提交单个答案并获取即时反馈

**请求体示例**:
```json
{
    "riddle_id": 1,
    "answer": "用户答案",
    "is_final": false  // 是否为最后一题
}
```

**响应示例** (普通题目):
```json
{
    "status": "success",
    "result": {
        "riddle_id": 1,
        "is_correct": true,
        "correct_answer": "标准答案",
        "current_stats": {
            "total_answered": 10,
            "correct_count": 8,
            "accuracy": 80.0
        }
    }
}
```

**响应示例** (最后一题):
```json
{
    "status": "success",
    "is_final": true,
    "final_stats": {
        "total_answered": 60,
        "correct_count": 45,
        "accuracy": 75.0
    },
    "result": {
        "riddle_id": 60,
        "is_correct": true,
        "correct_answer": "标准答案"
    }
}
```



### 3. 收集模式 API

#### 3.1 获取收集模式题目
```
GET /api/riddles/collection-mode/questions
```

**描述**: 获取5个随机灯谜题目

**响应示例**:
```json
{
    "status": "success",
    "questions": [
        {
            "id": 1,
            "title": "谜面内容",
            "hint": "谜底类型提示"
        }
        // ... 共5个题目
    ]
}
```

#### 3.2 提交收集模式答案
```
POST /api/riddles/collection-mode/submit/{piece_id}
```

**描述**: 提交收集模式的答案

**路径参数**:
- `piece_id`: 整数，目标碎片ID (1-20)

**请求体示例**:
```json
{
    "answers": [
        {
            "riddle_id": 1,
            "answer": "用户答案1"
        }
        // ... 共5个答案
    ]
}
```

**响应示例**:
```json
{
    "status": "success",
    "all_correct": true,
    "piece_obtained": true,
    "results": [
        {
            "riddle_id": 1,
            "is_correct": true,
            "correct_answer": "标准答案"
        }
        // ... 每个答案的结果
    ]
}
```

### 4. 排行榜 API

#### 4.1 获取排行榜
```
GET /api/riddles/leaderboard
```

**描述**: 获取竞速模式的排行榜

**响应示例**:
```json
{
    "status": "success",
    "leaderboard": [
        {
            "rank": 1,
            "user_id": 123,
            "name": "用户名",
            "correct": 50,
            "accuracy": 83.33
        }
        // ... 更多排名
    ]
}
```

## 错误处理

所有API在发生错误时会返回以下格式：

```json
{
    "detail": "错误信息描述"
}
```

常见HTTP状态码：
- 200: 请求成功
- 400: 请求参数错误
- 401: 未登录
- 404: 资源不存在
- 500: 服务器内部错误

## 注意事项

1. 首次访问时会自动创建游客账号并设置cookie
2. 竞速模式有180秒时间限制
3. 收集模式需要连续答对5题才能获得碎片
4. 头像上传支持常见图片格式（jpg, png等）
5. 修改用户信息后会自动成为正式用户

## 碎片编号说明

碎片ID按照(图片号-1)*4+象限的规则编号：
- 1-4: 图片1的四个象限
- 5-8: 图片2的四个象限
- 9-12: 图片3的四个象限
- 13-16: 图片4的四个象限
- 17-20: 图片5的四个象限