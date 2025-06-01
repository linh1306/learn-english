import { HttpException, HttpStatus } from '@nestjs/common';

interface ErrorConfig {
  mes: string;
  code: HttpStatus;
}

type ErrorResult<T> = {
  [K in keyof T]: T[K] extends { mes: string; code: HttpStatus }
    ? HttpException
    : T[K] extends object
      ? ErrorResult<T[K]>
      : never;
};

const err = {
  AUTH: {
    FORBIDDEN: { mes: 'Không có quyền thực hiện', code: HttpStatus.FORBIDDEN },
    UNAUTHORIZED: {
      mes: 'Chưa xác thực người dùng',
      code: HttpStatus.UNAUTHORIZED,
    },
    INVALID_CREDENTIALS: {
      mes: 'Tài khoản hoặc mật khẩu không chính xác',
      code: HttpStatus.UNAUTHORIZED,
    },
    BLOCKED: { mes: 'Tài khoản đã bị khóa', code: HttpStatus.FORBIDDEN },
    REQUIRED: { mes: 'Yêu cầu đăng nhập', code: HttpStatus.UNAUTHORIZED },
    ALREADY_EXISTS: { mes: 'Tài khoản đã tồn tại', code: HttpStatus.CONFLICT },
  },
  TOKEN: {
    EXPIRED: { mes: 'Token đã hết hạn', code: HttpStatus.UNAUTHORIZED },
    INVALID: { mes: 'Token không hợp lệ', code: HttpStatus.UNAUTHORIZED },
    NOT_FOUND: { mes: 'Không tìm thấy token', code: HttpStatus.UNAUTHORIZED },
    REFRESH_FAILED: {
      mes: 'Không thể làm mới token',
      code: HttpStatus.BAD_REQUEST,
    },
  },
  DATA: {
    COMMON: {
      NOT_FOUND: {
        mes: 'Không tìm thấy hoặc bạn không có quyền truy cập',
        code: HttpStatus.NOT_FOUND,
      },
      NOT_ALLOWED: {
        mes: 'Bạn không có quyền thực hiện thao tác này',
        code: HttpStatus.FORBIDDEN,
      },
    },
    USER: {
      NOT_FOUND: {
        mes: 'Không tìm thấy người dùng',
        code: HttpStatus.NOT_FOUND,
      },
      ALREADY_EXISTS: {
        mes: 'Người dùng đã tồn tại',
        code: HttpStatus.CONFLICT,
      },
      INVALID_INPUT: {
        mes: 'Thông tin người dùng không hợp lệ',
        code: HttpStatus.BAD_REQUEST,
      },
      DELETE_FAILED: {
        mes: 'Không thể xóa người dùng',
        code: HttpStatus.BAD_REQUEST,
      },
      UPDATE_FAILED: {
        mes: 'Không thể cập nhật thông tin người dùng',
        code: HttpStatus.BAD_REQUEST,
      },
    },
    GROUP_CHAT: {
      NOT_FOUND: {
        mes: 'Không tìm thấy nhóm chat',
        code: HttpStatus.NOT_FOUND,
      },
      ALREADY_EXISTS: {
        mes: 'Nhóm chat đã tồn tại',
        code: HttpStatus.CONFLICT,
      },
      CREATE_FAILED: {
        mes: 'Không thể tạo nhóm chat',
        code: HttpStatus.BAD_REQUEST,
      },
      DELETE_FAILED: {
        mes: 'Không thể xóa nhóm chat',
        code: HttpStatus.BAD_REQUEST,
      },
      UPDATE_FAILED: {
        mes: 'Không thể cập nhật nhóm chat',
        code: HttpStatus.BAD_REQUEST,
      },
      PERMISSION_DENIED: {
        mes: 'Bạn không có quyền thực hiện thao tác này trong nhóm chat',
        code: HttpStatus.FORBIDDEN,
      },
      USER_ALREADY_MEMBER: {
        mes: 'Người dùng đã là thành viên của nhóm chat này',
        code: HttpStatus.CONFLICT,
      },
      USER_NOT_MEMBER: {
        mes: 'Người dùng không phải là thành viên của nhóm chat này',
        code: HttpStatus.BAD_REQUEST,
      },
      ADMIN_REQUIRED: {
        mes: 'Chỉ quản trị viên mới có thể thực hiện thao tác này',
        code: HttpStatus.FORBIDDEN,
      },
    },
    MESSAGE: {
      NOT_FOUND: { mes: 'Không tìm thấy tin nhắn', code: HttpStatus.NOT_FOUND },
      DELETE_FAILED: {
        mes: 'Không thể xóa tin nhắn',
        code: HttpStatus.BAD_REQUEST,
      },
      UPDATE_FAILED: {
        mes: 'Không thể cập nhật tin nhắn',
        code: HttpStatus.BAD_REQUEST,
      },
      SEND_FAILED: {
        mes: 'Không thể gửi tin nhắn',
        code: HttpStatus.BAD_REQUEST,
      },
      PERMISSION_DENIED: {
        mes: 'Bạn không có quyền thao tác với tin nhắn này',
        code: HttpStatus.FORBIDDEN,
      },
    },
    SUBJECT: {
      NOT_FOUND: { mes: 'Không tìm thấy môn học', code: HttpStatus.NOT_FOUND },
      ALREADY_EXISTS: { mes: 'Môn học đã tồn tại', code: HttpStatus.CONFLICT },
      CREATE_FAILED: {
        mes: 'Không thể tạo môn học',
        code: HttpStatus.BAD_REQUEST,
      },
      UPDATE_FAILED: {
        mes: 'Không thể cập nhật môn học',
        code: HttpStatus.BAD_REQUEST,
      },
      DELETE_FAILED: {
        mes: 'Không thể xóa môn học',
        code: HttpStatus.BAD_REQUEST,
      },
    },
    LESSON: {
      NOT_FOUND: { mes: 'Không tìm thấy bài học', code: HttpStatus.NOT_FOUND },
      ALREADY_EXISTS: { mes: 'Bài học đã tồn tại', code: HttpStatus.CONFLICT },
      CREATE_FAILED: {
        mes: 'Không thể tạo bài học',
        code: HttpStatus.BAD_REQUEST,
      },
      UPDATE_FAILED: {
        mes: 'Không thể cập nhật bài học',
        code: HttpStatus.BAD_REQUEST,
      },
      DELETE_FAILED: {
        mes: 'Không thể xóa bài học',
        code: HttpStatus.BAD_REQUEST,
      },
      INVALID_TYPE: {
        mes: 'Loại bài học không hợp lệ',
        code: HttpStatus.BAD_REQUEST,
      },
    },
    POST: {
      NOT_FOUND: { mes: 'Không tìm thấy bài viết', code: HttpStatus.NOT_FOUND },
      CREATE_FAILED: {
        mes: 'Không thể tạo bài viết',
        code: HttpStatus.BAD_REQUEST,
      },
      UPDATE_FAILED: {
        mes: 'Không thể cập nhật bài viết',
        code: HttpStatus.BAD_REQUEST,
      },
      DELETE_FAILED: {
        mes: 'Không thể xóa bài viết',
        code: HttpStatus.BAD_REQUEST,
      },
      PERMISSION_DENIED: {
        mes: 'Bạn không có quyền thao tác với bài viết này',
        code: HttpStatus.FORBIDDEN,
      },
    },
    COMMENT: {
      NOT_FOUND: {
        mes: 'Không tìm thấy bình luận',
        code: HttpStatus.NOT_FOUND,
      },
      CREATE_FAILED: {
        mes: 'Không thể tạo bình luận',
        code: HttpStatus.BAD_REQUEST,
      },
      UPDATE_FAILED: {
        mes: 'Không thể cập nhật bình luận',
        code: HttpStatus.BAD_REQUEST,
      },
      DELETE_FAILED: {
        mes: 'Không thể xóa bình luận',
        code: HttpStatus.BAD_REQUEST,
      },
      PERMISSION_DENIED: {
        mes: 'Bạn không có quyền thao tác với bình luận này',
        code: HttpStatus.FORBIDDEN,
      },
    },
    NOTIFICATION: {
      NOT_FOUND: {
        mes: 'Không tìm thấy thông báo',
        code: HttpStatus.NOT_FOUND,
      },
      CREATE_FAILED: {
        mes: 'Không thể tạo thông báo',
        code: HttpStatus.BAD_REQUEST,
      },
      UPDATE_FAILED: {
        mes: 'Không thể cập nhật thông báo',
        code: HttpStatus.BAD_REQUEST,
      },
      DELETE_FAILED: {
        mes: 'Không thể xóa thông báo',
        code: HttpStatus.BAD_REQUEST,
      },
      PERMISSION_DENIED: {
        mes: 'Bạn không có quyền thao tác với thông báo này',
        code: HttpStatus.FORBIDDEN,
      },
    },
  },
  VALIDATION: {
    REQUIRED_FIELD: {
      mes: 'Trường dữ liệu bắt buộc',
      code: HttpStatus.BAD_REQUEST,
    },
    INVALID_FORMAT: {
      mes: 'Định dạng không hợp lệ',
      code: HttpStatus.BAD_REQUEST,
    },
    TOO_SHORT: { mes: 'Giá trị quá ngắn', code: HttpStatus.BAD_REQUEST },
    TOO_LONG: { mes: 'Giá trị quá dài', code: HttpStatus.BAD_REQUEST },
    INVALID_EMAIL: { mes: 'Email không hợp lệ', code: HttpStatus.BAD_REQUEST },
    INVALID_PASSWORD: {
      mes: 'Mật khẩu không đáp ứng yêu cầu bảo mật',
      code: HttpStatus.BAD_REQUEST,
    },
  },
  SYSTEM: {
    INTERNAL_ERROR: {
      mes: 'Lỗi hệ thống',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    SERVICE_UNAVAILABLE: {
      mes: 'Dịch vụ tạm thời không khả dụng',
      code: HttpStatus.SERVICE_UNAVAILABLE,
    },
    RATE_LIMITED: {
      mes: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
      code: HttpStatus.TOO_MANY_REQUESTS,
    },
    MAINTENANCE: {
      mes: 'Hệ thống đang bảo trì',
      code: HttpStatus.SERVICE_UNAVAILABLE,
    },
    TIMEOUT: {
      mes: 'Yêu cầu quá thời gian chờ',
      code: HttpStatus.REQUEST_TIMEOUT,
    },
  },
} as const;

function createErrors<T extends Record<string, any>>(obj: T): ErrorResult<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => {
      if ('mes' in val && 'code' in val) {
        const errorConfig = val as ErrorConfig;
        return [key, new HttpException(errorConfig.mes, errorConfig.code)];
      }
      return [key, createErrors(val)];
    }),
  ) as ErrorResult<T>;
}

export const ERR = createErrors(err);
