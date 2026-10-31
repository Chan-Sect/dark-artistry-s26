import {google} from 'googleapis'
import oauth2Client from "./google";
import QRCode from 'qrcode'

const gmail = google.gmail({version: 'v1', auth: oauth2Client})
const generateQR = (content: string) => QRCode.toBuffer(content, {
    type: 'png', width: 400, margin: 2, errorCorrectionLevel: 'H', color: {
        dark: '#075447',
        light: '#00000000'
    }
})


export const sendQR = async (to: string, name: string, code: string) => {
    const png = await generateQR(code)

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dark Artistry Service</title>
    </head>
    <body style="margin:0;padding:0;background:#e7ece7;font-family:Montserrat,sans-serif;color:#104f43">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
               style="background:#e7ece7;padding:24px 10px">
            <tr>
                <td align="center">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0"
                     style="width:100%;max-width:600px;background:#e7ece7">
                        <!-- Logo -->
                        <tr>
                        <td align="center" style="padding:20px 15px 38px">
                        <div style="font-size:13px;font-weight:bold;letter-spacing:1px;color:#49645c">
                          Dark Artistry<br>
                          Thông báo™
                        </div>
                        </td>
                        </tr>
                        <!-- Heading -->
                        <tr>
                        <td align="center" style="padding:0 15px">
                        <h1 style="margin:0;color:#075447;font-size:36px;line-height:1.12;font-weight:900;letter-spacing:1px">
                          MÃ QR ĐĂNG NHẬP
                        </h1>
                        <p style="margin:22px 0 0;font-size:16px;line-height:1.7;color:#344e46">
                          Xin chào <b>${name}</b>,<br>
                          Chúng tôi đã nhận được yêu cầu đăng ký của bạn!<br class="desktop">
                          Để tiếp tục, vui lòng quét mã QR bên dưới trong ứng dụng
                          <b>Dark Artistry Mobile</b>
                          để thực hiện đăng nhập
                        </p>
                        </td>
                        </tr>
                        <!-- QR Code -->
                        <tr>
                            <td align="center" style="padding:42px 10px 46px">
                                <table
                                    role="presentation"
                                    cellspacing="0"
                                    cellpadding="0"
                                    style="border:3px solid #075447;border-radius:18px; background-color: #b4d0c6"
                                >
                                    <tr>
                                        <td align="center" style="padding:12px;border-radius:15px">
                                          <img
                                                  src="cid:qrcode"
                                                  width="250"
                                                  height="250"
                                                  alt="Mã QR đăng nhập Dark Artistry"
                                                  style="display:block;width:250px;height:250px;max-width:100%;border:0"
                                          >
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Steps -->
                        <tr>
                        <td style="background:#064d42;padding:30px 8px">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="33.33%" align="center" valign="top"
                                style="padding:10px 8px;border-right:1px dashed #b4d0c6">
                              <div style="background:#e7ece7;color:#075447;border-radius:50%;width:44px;height:44px;line-height:44px;font-size:20px;font-weight:bold">
                                1
                              </div>
                              <p style="font-size:12px;line-height:1.6;color:#e7ece7;margin:18px 0 0">
                                Mở ứng dụng <b>Dark Artistry Mobile</b> trên thiết bị của bạn
                              </p>
                            </td>
                            <td width="33.33%" align="center" valign="top"
                                style="padding:10px 8px;border-right:1px dashed #b4d0c6">
                              <div style="background:#e7ece7;color:#075447;border-radius:50%;width:44px;height:44px;line-height:44px;font-size:20px;font-weight:bold">
                                2
                              </div>
                              <p style="font-size:12px;line-height:1.6;color:#e7ece7;margin:18px 0 0">
                                Lựa chọn <b>"Đăng nhập bằng mã QR"</b>
                              </p>
                            </td>
                            <td width="33.33%" align="center" valign="top"
                                style="padding:10px 8px">
                              <div style="background:#e7ece7;color:#075447;border-radius:50%;width:44px;height:44px;line-height:44px;font-size:20px;font-weight:bold">
                                3
                              </div>
                              <p style="font-size:12px;line-height:1.6;color:#e7ece7;margin:18px 0 0">
                                Quét mã QR ở trên và hoàn tất
                              </p>
                            </td>
                          </tr>
                        </table>
                        </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                        <td align="center" style="padding:25px 10px 30px">
                        <p style="margin:0;font-size:13px;font-weight:bold;letter-spacing:1px;color:#164f43">
                          HƯỚNG DẪN QUÉT MÃ QR TRONG ỨNG DỤNG <b>DARK ARTISTRY MOBILE</b>
                        </p>
                        <p style="margin:14px 0 0;font-size:11px;color:#587269">
                          Vui lòng không chia sẻ mật mã QR này cho bất kỳ ai để tránh rò rỉ thông tin cá nhân.
                        </p>
                        </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
`


    const boundary = `boundary_${Date.now()}`
    const alternative = `alternative_${Date.now()}`

    const mime = [
        `From: =?UTF-8?B?${Buffer.from('Dark Artistry - Thông báo hệ thống').toString('base64')}?= <${process.env.GMAIL_USER}>`,
        `To: =?UTF-8?B?${Buffer.from(name).toString('base64')}?= <${to}>`,
        `Subject: =?UTF-8?B?${Buffer.from('Quét mã QR để đăng nhập').toString('base64')}?=`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/related; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        `Content-Type: multipart/alternative; boundary="${alternative}"`,
        '',
        `--${alternative}`,
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(html).toString('base64'),
        `--${alternative}--`,
        `--${boundary}`,
        'Content-Type: image/png; name="qrcode.png"',
        'Content-Transfer-Encoding: base64',
        'Content-ID: <qrcode>',
        'Content-Disposition: inline; filename="qrcode.png"',
        '',
        png.toString('base64').match(/.{1,76}/g)?.join('\r\n') ?? '',
        `--${boundary}--`
    ].join('\r\n')

    const raw = Buffer.from(mime).toString('base64url')

    const result = await gmail.users.messages.send({userId: 'me', requestBody: {raw}})

    return result.data
}