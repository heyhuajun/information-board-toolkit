/**
 * 布局验证工具
 * 帮助 Agent 在提交前检查数据格式是否正确
 */
import { Component } from '../types';
export interface ValidationError {
    path: string;
    message: string;
    severity: 'error' | 'warning';
}
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
}
/**
 * 验证布局数据
 */
export declare function validateLayout(layout: Component): ValidationResult;
/**
 * 格式化验证结果为可读文本
 */
export declare function formatValidationResult(result: ValidationResult): string;
