// SchedulingSystem/LaborLawCheckModal.js
import React from 'react';
import './LaborLawCheckModal.css';

const LaborLawCheckModal = ({ 
  isOpen, 
  onClose, 
  checkResult, 
  isLoading 
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case '輕微': return '#ffa500';
      case '中等': return '#ff6b35';
      case '嚴重': return '#e74c3c';
      case '重大': return '#c0392b';
      default: return '#ff6b35';
    }
  };

  const getArticleColor = (articleNum) => {
    const colors = {
      30: '#3498db',
      32: '#e67e22',
      34: '#e74c3c',
      35: '#f39c12',
      36: '#9b59b6',
      37: '#8e44ad'
    };
    return colors[articleNum] || '#95a5a6';
  };

  // 🔧 Debug: 在 render 前檢查資料
  console.log('🎭 Modal 收到的 checkResult:', checkResult);

  return (
    <div className="labor-law-modal-overlay" onClick={handleOverlayClick}>
      <div className="labor-law-modal">
        <div className="labor-law-modal-header">
          <h2>🔍 勞動基準法合規檢查結果</h2>
          <button className="labor-law-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="labor-law-modal-content">
          {isLoading ? (
            <div className="labor-law-loading">
              <div className="loading-spinner"></div>
              <p>正在檢查勞基法合規性...</p>
            </div>
          ) : checkResult ? (
            <>
              {checkResult.error ? (
                <div className="labor-law-error">
                  <div className="error-icon">❌</div>
                  <h3>檢查失敗</h3>
                  <p>{checkResult.error}</p>
                </div>
              ) : (
                <>
                  {/* 🔧 Debug 資訊 - 可以在正式版本中移除 */}
                  <div className="debug-info" style={{ 
                    background: '#f8f9fa', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    marginBottom: '20px',
                    fontSize: '0.8rem',
                    color: '#6c757d'
                  }}>
                    <strong>Debug:</strong> hasViolations={String(checkResult.hasViolations)}, 
                    violatedEmployeeCount={checkResult.violatedEmployeeCount}, 
                    violations={checkResult.violations?.length || 0}
                  </div>

                  {/* 檢查摘要 */}
                  <div className="labor-law-summary">
                    <div className="summary-stats">
                      <div className={`stat-card ${checkResult.hasViolations ? 'violation' : 'compliant'}`}>
                        <div className="stat-icon">
                          {checkResult.hasViolations ? '⚠️' : '✅'}
                        </div>
                        <div className="stat-info">
                          <div className="stat-value">
                            {checkResult.hasViolations ? '發現違法' : '完全合規'}
                          </div>
                          <div className="stat-label">檢查結果</div>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                          <div className="stat-value">{checkResult.violatedEmployeeCount || 0}</div>
                          <div className="stat-label">違法員工數</div>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                          <div className="stat-value">{checkResult.violationCount || 0}</div>
                          <div className="stat-label">違法項目數</div>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                          <div className="stat-value">{checkResult.complianceRate || '100%'}</div>
                          <div className="stat-label">合規率</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 違法詳情 */}
                  {checkResult.hasViolations && checkResult.violations && checkResult.violations.length > 0 && (
                    <div className="labor-law-violations">
                      <h3>🚨 違法詳情</h3>
                      <div className="violations-list">
                        {checkResult.violations.map((violation, index) => (
                          <div key={index} className="violation-item">
                            <div className="violation-header">
                              <div className="employee-info">
                                <span className="employee-id">👤 {violation.employeeId}</span>
                                {violation.employeeName && (
                                  <span className="employee-name">({violation.employeeName})</span>
                                )}
                                <span 
                                  className="severity-badge"
                                  style={{ backgroundColor: getSeverityColor(violation.severity) }}
                                >
                                  {violation.severity}
                                </span>
                              </div>
                              <div 
                                className="article-badge"
                                style={{ backgroundColor: getArticleColor(violation.article) }}
                              >
                                第{violation.article}條
                              </div>
                            </div>
                            <div className="violation-content">
                              <div className="article-name">{violation.articleName}</div>
                              <div className="violation-details">
                                {violation.details && violation.details.map((detail, detailIndex) => (
                                  <div key={detailIndex} className="detail-item">
                                    • {detail}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 🔧 如果有違法但沒有詳細資料，顯示基本資訊 */}
                  {checkResult.hasViolations && (!checkResult.violations || checkResult.violations.length === 0) && (
                    <div className="labor-law-violations">
                      <h3>🚨 違法概況</h3>
                      <div className="violation-summary">
                        <div className="summary-item">
                          <strong>違法員工數：</strong>{checkResult.violatedEmployeeCount || 0} 人
                        </div>
                        <div className="summary-item">
                          <strong>合規率：</strong>{checkResult.complianceRate || '0%'}
                        </div>
                        <div className="summary-note">
                          ⚠️ 詳細違法資訊正在處理中，請稍後重新檢查或聯繫系統管理員。
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 改善建議 */}
                  {checkResult.suggestions && checkResult.suggestions.length > 0 && (
                    <div className="labor-law-suggestions">
                      <h3>💡 改善建議</h3>
                      <div className="suggestions-list">
                        {checkResult.suggestions.map((suggestion, index) => (
                          <div key={index} className="suggestion-item">
                            • {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 無違法情況 */}
                  {!checkResult.hasViolations && (
                    <div className="labor-law-compliant">
                      <div className="compliant-icon">🎉</div>
                      <h3>恭喜！排班完全符合勞動基準法規定</h3>
                      <p>所有員工的排班安排都符合相關法規要求，請持續維持良好的排班管理。</p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="labor-law-error">
              <div className="error-icon">❌</div>
              <h3>檢查失敗</h3>
              <p>無法取得檢查結果，請稍後再試。</p>
            </div>
          )}
        </div>

        <div className="labor-law-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaborLawCheckModal;
