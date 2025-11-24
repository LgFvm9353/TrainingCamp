import styles from './SpecSelector.module.css';
import type { ProductSpec } from '../../types/product';

interface SpecSelectorProps {
  specs: ProductSpec[];
  selectedSpecs: Record<string, string>;
  onSpecChange: (specName: string, value: string) => void;
}

const SpecSelector = ({ specs, selectedSpecs, onSpecChange }: SpecSelectorProps) => {
  return (
    <div className={styles.specSelector}>
      {specs.map((spec) => (
        <div key={spec.name} className={styles.specGroup}>
          <div className={styles.specName}>{spec.name}：</div>
          <div className={styles.specValues}>
            {spec.values.map((value) => (
              <button
                key={value}
                className={`${styles.specValue} ${
                  selectedSpecs[spec.name] === value ? styles.selected : ''
                }`}
                onClick={() => onSpecChange(spec.name, value)}
                type="button"
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpecSelector;

