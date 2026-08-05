import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function KakaoAuthPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[430px] h-screen bg-white flex flex-col overflow-hidden">
        {/* Top header */}
        <div className="relative flex items-center justify-center pt-10 pb-6 shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition"
          >
            <ChevronLeft size={22} className="text-gray-700" />
          </button>
          <span className="text-2xl font-light tracking-widest text-gray-800">
            kakao
          </span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* App info */}
          <div className="px-5 pb-3">
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#F7E600" }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M11 2C6.03 2 2 5.36 2 9.5c0 2.73 1.67 5.13 4.2 6.54L5.13 19.4a.35.35 0 0 0 .53.38L10 17.1c.32.04.66.06 1 .06 4.97 0 9-3.36 9-7.5S15.97 2 11 2z"
                    fill="#3C1E1E"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">
                  주뜨청년부
                </p>
                <p className="text-xs text-gray-400">
                  서울여대 대학교회 청년부
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="mt-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500">
                test@kakao.com
              </p>
            </div>
          </div>

          {/* Notice text */}
          <div className="px-5 pb-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-amber-700 leading-relaxed text-[14px]">
                카카오 계정으로 로그인을 진행하는 임시 페이지
                입니다.
                <br />
                테스트를 위한 로그인은 뒤로 돌아가서 테스트
                로그인으로 진행해주세요.
              </p>
            </div>
          </div>

          {/* Divider text */}
          <div className="px-5 pb-1">
            <p className="text-xs text-gray-400">
              전체 선택하기는 선택 항목을 포함하고 있으며, 선택
              항목에 동의하지 않아도 서비스를 이용할 수
              있습니다.
            </p>
          </div>

          {/* Section: 카카오 로그인 동의 */}
          <div className="px-5 pt-3 pb-1">
            <p className="text-sm font-bold text-gray-800 mb-1">
              카카오 로그인 동의
            </p>
            <p className="text-xs text-gray-500 mb-2">
              주뜨청년부 서비스 이용을 위해 카카오와 함께
              개인정보가 제공됩니다.
            </p>

            <ConsentItem
              required
              text="(필수) 카카오 개인정보 제3자 제공 동의"
            />
            <div className="pl-4 pb-1.5">
              <p className="text-xs text-gray-400">
                프로필 정보(닉네임/프로필 사진),
                카카오계정(이메일), 성별, 카카오계정(전화번호),
                출생 연도, 성별, 이름
              </p>
            </div>

            <ConsentItem
              optional
              text="(선택) 카카오 개인정보 제3자 제공 동의"
            />
            <div className="pl-4 pb-1.5">
              <p className="text-xs text-gray-400">
                배송지정보(수령인명, 배송지 주소, 전화번호)
              </p>
            </div>
          </div>

          {/* Section: 서비스 동의 */}
          <div className="px-5 pt-2 pb-1">
            <p className="text-sm font-bold text-gray-800 mb-1">
              주뜨청년부 서비스 동의
            </p>
            <p className="text-xs text-gray-500 mb-2">
              주뜨청년부 서비스 이용을 위해 설정된
              동의항목입니다.
            </p>

            <ConsentItem
              required
              text="(필수) 서비스 이용 약관"
            />
            <ConsentItem
              optional
              text="(선택) 주뜨청년부 채널을 친구로 추가하고, 광고와 마케팅 메시지를 카카오톡으로 받습니다."
            />
          </div>

          {/* 안내사항 */}
          <div className="px-5 pt-2 pb-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">
              안내사항
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              본 동의는 주뜨청년부 서비스 이용을 위한 것으로,
              동의 후에도 서비스 내 설정에서 철회할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Bottom buttons — always fixed at bottom */}
        <div className="px-5 pb-10 pt-4 space-y-2 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="w-full py-4 rounded-2xl text-gray-900 text-base font-bold active:opacity-80 transition"
            style={{ backgroundColor: "#F7E600" }}
          >
            앱 회원가입으로 연결(임시)
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-3 text-sm text-gray-400"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

function ConsentItem({
  required,
  text,
}: {
  required: boolean;
  text: string;
}) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-100">
      <div className="flex items-start gap-2.5 flex-1">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
            required
              ? "border-gray-800 bg-gray-800"
              : "border-gray-300"
          }`}
        >
          {required && (
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
            >
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <p className="text-sm text-gray-700 leading-snug">
          {text}
        </p>
      </div>
      <ChevronRight
        size={16}
        className="text-gray-400 shrink-0 mt-0.5 ml-2"
      />
    </div>
  );
}