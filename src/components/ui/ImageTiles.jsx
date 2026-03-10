/**
 * 역할: 3장 이미지를 겹쳐서 펼치는 애니메이션 타일 컴포넌트
 * 주요 기능: 스태거 펼침 + hover 인터랙션
 * 의존성: motion/react
 * 출처: https://21st.dev/r/tonyzebastian/image-tiles (JSX 변환)
 */
import { motion } from "motion/react";

export default function ImageTiles({ leftImage, middleImage, rightImage }) {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { delay: 0.2, staggerChildren: 0.2 },
    },
  };

  const leftImageVariants = {
    initial: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: -8, x: -150, y: 10,
      transition: { type: "spring", stiffness: 120, damping: 12 },
    },
    hover: {
      rotate: 1, x: -160, y: 0,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
  };

  const middleImageVariants = {
    initial: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: 6, x: 0, y: 0,
      transition: { type: "spring", stiffness: 120, damping: 12 },
    },
    hover: {
      rotate: 0, x: 0, y: -10,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
  };

  const rightImageVariants = {
    initial: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: -6, x: 200, y: 20,
      transition: { type: "spring", stiffness: 120, damping: 12 },
    },
    hover: {
      rotate: 3, x: 200, y: 10,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
  };

  return (
    <motion.div
      className="relative flex items-center justify-center w-64 h-64 my-12"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="absolute w-48 h-48 origin-bottom-right overflow-hidden rounded-xl shadow-lg bg-white"
        variants={leftImageVariants}
        whileHover="hover"
        animate="animate"
        style={{ zIndex: 30 }}
      >
        <img src={leftImage} alt="이미지 1" className="object-cover p-2 rounded-xl w-full h-full" />
      </motion.div>

      <motion.div
        className="absolute w-48 h-48 origin-bottom-left overflow-hidden rounded-xl shadow-lg bg-white"
        variants={middleImageVariants}
        whileHover="hover"
        animate="animate"
        style={{ zIndex: 20 }}
      >
        <img src={middleImage} alt="이미지 2" className="object-cover p-2 rounded-2xl w-full h-full" />
      </motion.div>

      <motion.div
        className="absolute w-48 h-48 origin-bottom-right overflow-hidden rounded-xl shadow-lg bg-white"
        variants={rightImageVariants}
        whileHover="hover"
        animate="animate"
        style={{ zIndex: 10 }}
      >
        <img src={rightImage} alt="이미지 3" className="object-cover p-2 rounded-2xl w-full h-full" />
      </motion.div>
    </motion.div>
  );
}
