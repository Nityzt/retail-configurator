import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
}

export const SectionTitle = ({ title, subtitle, backgroundColor = '#fff', textColor = '#000' }: SectionTitleProps) => {
  return (
    <section className="h-screen w-full flex items-center justify-center snap-start snap-always" style={{ backgroundColor }}>
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="text-6xl md:text-8xl font-bold"
          style={{ color: textColor }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="text-xl md:text-2xl mt-4 opacity-70"
            style={{ color: textColor }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
};
