

const STATUS_CODE = {
  EXPIRED: '/static/image/1.png',
  TODAY_UPDATED: '/static/image/2.png',
  NEED_MODIFY: '/static/image/3.png',
  FULL_GROUP: '/static/image/4.png',
  INVALID_GROUP: '/static/image/5.png'
}

function feedbackFn(data) {
  const {
    status,
    updateTime,
    qrcodeExpire,
    feedbackStatus
  } = data;

  // 获取今天日期（兼容小程序环境）
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 条件优先级顺序保持不变
  if (status === '待修改') {
    return STATUS_CODE.NEED_MODIFY; // 请确保在小程序环境中已定义该常量
  }

  if (updateTime) {
    const updateDate = new Date(updateTime);
    updateDate.setHours(0, 0, 0, 0);
    if (+updateDate === +today) {
      return STATUS_CODE.TODAY_UPDATED;
    }
  }

  if (qrcodeExpire) {
    const expireDate = new Date(qrcodeExpire);
    expireDate.setHours(0, 0, 0, 0);
    if (+expireDate < +today) {
      return STATUS_CODE.EXPIRED;
    }
  }

  if (feedbackStatus === '群已满') {
    return STATUS_CODE.FULL_GROUP;
  }

  if (feedbackStatus === '群失效') {
    return STATUS_CODE.INVALID_GROUP;
  }

  return null;
}

function getWeekday(dateTime) {
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      console.warn('无效的日期参数:', dateTime);
      return '';
    }
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  } catch (e) {
    console.error('日期处理错误:', e);
    return '';
  }
}


module.exports = {
  feedbackFn,
  getWeekday
};
