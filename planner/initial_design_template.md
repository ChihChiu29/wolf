## Overview

这是一个单机“狼人杀”的游戏。所有的bot都是local LLM控制的，并且都有自己的personality。

游戏是对话框选择的界面，用HTML5, served by static content server。

## Game Menu

进入游戏会有以下选项：
1. 生成personality file -- 生成一个新的AI personality
2. 删除personality file
2. 开始游戏 -- 必须至少有一个personality file
3. 退出

## Game Flow

选择开始游戏后:
1. 每一个玩家，包括player和bot，会做一轮自我介绍
2. 介绍后，系统发给每个player and bot它的身份，只有player的身份会告诉player
3. 

## AI Personality file

Personality file 是一个 markdown 文件。这个文件以某一个first name命名，里面的内容包括：
[哪些personality对应玩好狼人杀游戏是相关的?加入这里]

## 狼人杀规则

[简单列出狼人杀的规则，人物分配，等等]
