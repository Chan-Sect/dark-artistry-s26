import Response, { Errors } from "./type";
import colors from "colors";

// type MethodType = 'get' | 'post' | 'put' | 'patch' | 'delete'

export class Error
{
    static PageNotFound = (method: string, path: string) => Errors.NotFound(`Không tìm thấy trang, kiểm tra lại phương thức <${ method }> hoặc đường dẫn : ${ path }`)

    static NotFound = (data: Record<string, unknown>) => Errors.NotFound(`Không tìm thấy <${ data[Object.keys(data)[0]] }> : kiểm tra trường <${ Object.keys(data)[0] }>`)
    static Database = (name?: string) => Errors.ServiceUnavailable(name ? 'Database không thể khởi động' : `Database bị lỗi : ${ name }`)
    static MissingFields = (...fields: string[]) => Errors.BadRequest(`Thiếu trường : ${ fields.join(', ')}`)
    static BlankFields = (...fields: string[]) => Errors.LengthRequired(`Trường rỗng : ${ fields.join(', ')}`)
    static File = (mime: string) => Errors.UnsupportedMediaType(mime ? `Chỉ cho phép đuôi file : ${ mime }` : 'File lỗi')

    static Exists = (value: string) => Errors.Conflict(`<${ value }> đã tồn tại`)
    static DeleteParent = Errors.Conflict('Không thể xoá tài nguyên có giá trị ràng buộc')
    static OverrideParent = (func: string) => Errors.Locked(`Hàm <${ func }> ép buộc phải override`)

    static Online = Errors.NotAcceptable('Tài khoản đang online')

    static DeleteRoot = Errors.Forbidden('Không thể xoá tài nguyên hệ thống')
    static EditRoot = Errors.Forbidden('Không thể sửa tài nguyên hệ thống')
    static DeleteDefault = Errors.Forbidden('Không thể xoá tài nguyên mặc định')
    static Forbidden = Errors.Forbidden('Bạn không đủ quyền để thao tác mục này')
    static HigherRankInteract = Errors.Forbidden('Bạn chỉ có thể chỉnh sửa tài khoản có quyền thấp hơn bạn')
    static HigherRankEdit = Errors.Forbidden('Bạn không thể cấp quyền cao hơn hoặc bằng quyền của bản thân')

    static MethodNotAllow = Errors.MethodNotAllowed('Phương thức không được hỗ trợ')

    static Authentication = Errors.Unauthorized(`Chưa đăng nhập`)
    static Verification = Errors.Unauthorized(`Sai mã xác thực`)
    static Password = Errors.Unauthorized(`Sai tên tài khoản hoặc mật khẩu`)
    static RequirePassword = (have: boolean = true) => Errors.MethodNotAllowed(`Phương thức yêu cầu tài khoản ${ have ? 'có' : 'không' } chứa mật khẩu`)
    static WrongFields = Errors.BadRequest('Trường không hợp lệ')

    static CreatedButCannotSign = Errors.MethodFailure('Tài khoản đã được tạo, nhưng không thể đăng nhập')
    static AccountLocked = Errors.Locked('Tài khoản bị khoá')
}

export class Success
{
    static View = new Response('Xem thành công', 200)
    static Add = new Response('Thêm thành công', 200)
    static Edit = new Response('Sửa thành công', 200)
    static Delete = new Response('Xoá thành công', 200)

    static Database = () => new Response(colors.green(`Kết nối ${ colors.bold.magenta('Database') } thành công !!`), 200)
}

// module.exports.Error = Error
// module.exports.Success = Success