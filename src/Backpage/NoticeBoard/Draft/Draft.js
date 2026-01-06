import React, { useState, useEffect, useRef } from 'react';
import UploadAnnouncement from '../Upload_Announcement';
import './Draft.css';
import { API_BASE_URL } from '../../../config';

const Draft = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false);

  // 🔥 從 cookies 獲取資料的輔助函數
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // 🔥 格式化日期顯示 (MM-DD 格式)
  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
  };

  // 🔥 格式化時間顯示 (HH:MM 格式)
  const formatTimeDisplay = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // 取 HH:MM 部分
  };

  // 🔥 判斷 AM/PM
  const getPeriod = (timeString) => {
    if (!timeString) return '';
    const hour = parseInt(timeString.split(':')[0]);
    return hour >= 12 ? 'PM' : 'AM';
  };

  // 🔥 查詢草稿資料
  const fetchDrafts = async () => {
    if (isLoadingRef.current) {
      console.log('🔥 已在載入中，跳過重複查詢');
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);
      
      const companyId = getCookie('company_id');
      
      if (!companyId) {
        setError('無法獲取公司資訊，請重新登入！');
        return;
      }

      console.log('🔥 開始查詢草稿，公司ID:', companyId);

      // 🔥 查詢草稿狀態的公告
      const response = await fetch(`${API_BASE_URL}/api/announcements?company_id=${companyId}&status=draft&_t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      console.log('🔥 API 回應:', result);

      if (response.ok && result.Status === 'Ok') {
        console.log('🔥 查詢到的草稿數量:', result.Data.announcements.length);

        // 🔥 轉換資料格式
        const formattedDrafts = result.Data.announcements.map(draft => ({
          id: draft.id,
          document_number: draft.document_number,
          title: draft.title,
          content: draft.content,
          createDate: formatDateDisplay(draft.created_at || draft.publish_date),
          createTime: formatTimeDisplay(draft.created_at ? new Date(draft.created_at).toTimeString() : draft.publish_time),
          period: getPeriod(draft.created_at ? new Date(draft.created_at).toTimeString() : draft.publish_time),
          creator: draft.employee_id,
          company_id: draft.company_id,
          employee_id: draft.employee_id,
          publish_date: draft.publish_date,
          publish_time: draft.publish_time,
          end_date: draft.end_date,
          end_time: draft.end_time,
          status: draft.status,
          created_at: draft.created_at,
          updated_at: draft.updated_at,
          // 🔥 為編輯模式準備的資料
          attachments: [],
          images: [],
          schedulePublish: draft.publish_date && draft.publish_time ? true : false,
          scheduleRemove: draft.end_date && draft.end_time ? true : false,
          publishDateTime: draft.publish_date && draft.publish_time 
            ? `${draft.publish_date}T${draft.publish_time}` 
            : null,
          removeDateTime: draft.end_date && draft.end_time 
            ? `${draft.end_date}T${draft.end_time}` 
            : null
        }));

        console.log('🔥 格式化後的草稿數量:', formattedDrafts.length);
        setDrafts(formattedDrafts);
        setError(null);
      } else {
        setError(result.Msg || '查詢失敗');
      }
    } catch (error) {
      console.error('查詢草稿失敗:', error);
      setError('網路錯誤，請稍後再試！');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  // 🔥 組件載入時查詢資料
  useEffect(() => {
    fetchDrafts();
  }, []);

  // 🔥 處理編輯草稿
  const handleEditDraft = (draft) => {
    console.log('🔥 編輯草稿:', draft);
    setEditingDraft(draft);
    setIsEditMode(true);
  };

// 🔥 處理儲存編輯
const handleSaveEdit = async (updatedData, isPublish = false) => {
  try {
    console.log('🔥 儲存編輯資料:', updatedData, '是否發布:', isPublish);

    // 🔥 不需要在這裡調用 API，因為 Upload_Announcement 已經處理了
    if (isPublish) {
      alert('公告已發布！');
    } else {
      alert('草稿已更新！');
    }
    
    // 重新載入資料
    await fetchDrafts();
    
    setIsEditMode(false);
    setEditingDraft(null);
  } catch (error) {
    console.error('儲存編輯失敗:', error);
    alert('操作失敗，請稍後再試！');
  }
};


  // 🔥 處理取消編輯
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingDraft(null);
  };

  // 🔥 編輯模式 - 草稿可以編輯，不是只讀模式
  if (isEditMode && editingDraft) {
    return (
      <div className="draft-edit-mode-container">
        <UploadAnnouncement
          isEditMode={true}
          editData={editingDraft}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          hideBottomButtons={false} // 🔥 草稿編輯顯示底部按鈕
          readOnly={false} // 🔥 草稿編輯不是只讀模式
        />
      </div>
    );
  }

  // 🔥 載入中狀態
  if (loading) {
    return (
      <div className="draft-content-area">
        <div className="draft-loading">
          <div className="draft-loading-text">載入中...</div>
        </div>
      </div>
    );
  }

  // 🔥 錯誤狀態
  if (error) {
    return (
      <div className="draft-content-area">
        <div className="draft-error">
          <div className="draft-error-text">{error}</div>
          <button 
            className="draft-retry-button"
            onClick={fetchDrafts}
          >
            重試
          </button>
        </div>
      </div>
    );
  }

  // 🔥 主要內容
  return (
    <div className="draft-content-area">
      {/* 表頭 */}
      <div className="draft-header">
        <div className="draft-header-title">標題</div>
        <div className="draft-header-info">
          <div className="draft-header-date">建立時間</div>
          <div className="draft-header-creator">建立者</div>
        </div>
      </div>

      {/* 草稿列表 */}
      <div className="draft-list">
        {drafts.length === 0 ? (
          <div className="draft-empty">

          </div>
        ) : (
          drafts.map((draft) => (
            <div key={draft.id} className="draft-item-frame">
              <div 
                className="draft-item"
                onClick={() => handleEditDraft(draft)} // 🔥 點擊進入編輯模式
              >
                <div className="draft-item-content">
                  {/* 標題 */}
                  <div className="draft-item-title">
                    {draft.title}
                  </div>
                  
                  {/* 右側資訊 */}
                  <div className="draft-item-info">
                    {/* 日期 */}
                    <div className="draft-date-group">
                      <div className="draft-date">
                        {draft.createDate}
                      </div>
                    </div>
                    
                    {/* 時間 */}
                    <div className="draft-time-group">
                      <div className="draft-time">
                        <div className="draft-time-value">
                          {draft.createTime}
                        </div>
                      </div>
                      <div className="draft-period">
                        {draft.period}
                      </div>
                    </div>
                    
                    {/* 建立者 */}
                    <div className="draft-creator-group">
                      <div className="draft-creator">
                        {draft.creator}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 捲軸 */}
      <div className="draft-scrollbar"></div>
    </div>
  );
};

export default Draft;
