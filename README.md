# kuma-base

## 概念

### COLORS

> 品牌色、中立色、功能色为颜色的基础框架，UI设计中的任何颜色都要在此框架下产生，调色板中包含设计中的所有颜色。建议品牌色中基准色位于调色板中的中间位置，方便与向深浅两个方向拓展。

#### 品牌色

> 品牌色分主品牌色和品牌辅助色。品牌核心颜色，代表品牌对外形象及VI识别。主色的数量根据品牌特性制定，可以1个也可以多个。用于主要Button、ICON等需要突出品牌特征的地方。主品牌色来源于品牌的代表色颜色，通常来源于LOGO。子品牌、子服务等衍生业务可以由次级品牌色构成，也可以由主品牌色构成，主要依据品牌策略和业务模式。

| 变量名 | 说明 |
| --- | --- |
| @brand-primary | 主品牌色 |
| @brand-secondary | 子品牌色 |
| @brand-complement | 补色 | 
| @brand-comosite | 复合 |
| @brand-deep | 浓度 |

#### 中立色

> 灰或饱和度低的颜色（如蓝灰）用与界面设计中背景、边框、分割线、ICON、中立插图等。

| 变量名 | 说明 |
| --- | --- |
| @basic-100 | 浅 |
| @basic-200 | |
| @basic-300 | |
| @basic-400 | |
| @basic-500 | |
| @basic-600 | |
| @basic-700 | 深 |
| @gray-dark | #333 |
| @gray | #666 |
| @gray-light | #999 |
| @gray-lighter | #ccc |


#### 功能色

> 分类：信息提示类 、连接色类。用于UI设计中需要引起注意的设计。如：流程中的进度、提醒、成功等。

##### 信息提示色

| 变量名 | 说明 |
| --- | --- |
| @brand-success | 确认 成功 正向积极 |
| @brand-success-lighter | |
| @brand-info | |
| @brand-info-lighter | |
| @brand-warning | 警告 强调 着重说明 |
| @brand-warning-lighter | |
| @brand-danger | 强警告 出错 引起注意 |
| @brand-danger-lighter | |

##### 链接色

| 变量名 | 说明 |
| --- | --- |
| @link-color | normal |
| @link-hover-color | hover |
| @link-active-color | click |
| @link-visited-color | visited |
| @link-disabled-color | disable |

##### 文本色

| 变量名 | 说明 |
| --- | --- |
| @text-primary-color | 主要文本 |
| @text-secondary-color | 次要文本 |
| @text-thirdary-color | 辅助文本 |
| @text-helper-color | 提示，禁用文本 |
| @text-ali-color | 阿里橙 (用于加强显示的文案或超链接)｜

更多的颜色定义的变量请查看 variables/colors

### 关于上一个版本的 kuma 兼容

老版本中的变量在新版本中保留，保存在 memories 目录下，开发人员在开发新的变量时，请注意核对是否冲突。

### 主题

内置两款主题：`橙色系` 和 `蓝色系`

## 如何开发

```sh
git clone git@github.com:uxcore/kuma-base.git
cd kuma-base
npm install
gulp
```
