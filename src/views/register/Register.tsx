import { Link } from 'react-router-dom';
import backgroundleft from '../login/backgroundLeft.png';
import image from '../login/image.png';

export default function Register() {
  return (
    <>
      <div className="flex m-auto shadow-lg items-stretch h-screen">
        <div className="w-[70%] p-5 flex">
          <img src={backgroundleft} className="w-full h-full object-cover rounded-lg" alt="Image" />
        </div>
        <div className="w-[30%] p-5 flex flex-col rounded-lg border-white border-2 shadow-2xl m-0 h-full">
          <div className="flex gap-3 items-center mb-4">
            <img src={image} className="w-12 h-12" alt="LogoNLU" />
            <div className="flex items-center text-2xl">NLU</div>
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <div className="font-medium">Create your account</div>

            <div className="flex flex-col ">
              <label htmlFor="username" className="font-bold text-sm text-left">Username:</label>
              <input type="text" className="mt-1 p-2 w-full bg-[#F2F2F2] rounded-md pr-10" placeholder="Username" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="font-bold text-sm text-left">Password:</label>
              <input type="password" id="password" placeholder="Enter your Password" required name="password" className="mt-1 p-2 w-full bg-[#F2F2F2] rounded-md pr-10" />
            </div>

            <button className="bg-[#007AFF] p-2 mt-3 text-white font-medium rounded-lg">Register</button>

            <div className="flex justify-center gap-3">
              <div className='text-sm'>Already have an account?</div>
              <Link to="/" className="text-blue-600 text-sm">Sign in</Link>
            </div>
          </div>

          <div className="flex justify-between">
            <div className='font-bold text-sm'>Nhóm</div>
            <div className='font-bold text-sm'>WebChat</div>
          </div>
        </div>
      </div>
    </>
  );
}
