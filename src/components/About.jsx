
import { MaskContainer } from "./ui/svg-mask-effect";

export function About() {
  return (
    <div className="h-[40rem] flex items-center justify-center  overflow-hidden ">
      <MaskContainer
        revealText={
          <p className="  text-slate-800 text-center  text-4xl font-bold">
            {/* write about us we are edtech company which help children learn */}
            We are the best in the business of teaching your child! We use AI to help your child learn better


            
          </p>
        }
        className="h-[40rem]  "
      >
                    We are the <span className="bg-gradient-to-r from-cyan-600 to-purple-600 text-transparent bg-clip-text">best</span> in the business of teaching your child! We use <span className="bg-gradient-to-r from-cyan-600 to-purple-600 text-transparent bg-clip-text">AI</span> to help your child learn better

      </MaskContainer>
    </div>
  );
}
