import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StepOne from "./step-1";
import StepTwo from "./step-2";
import StepThree from "./step-3";
import StepFour from "./step-4";
import StepFive from "./step-5";
import StepSix from "./step-6";

const PropertyMultiStepForm: React.FC = () => {
  const [step, setStep] = useState(1);

  const nextStep = (currentStep: number) => {
    setStep(currentStep + 1);
  };

  const prevStep = (currentStep: number) => {
    setStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepTwo step={step} nextStep={nextStep} prevStep={prevStep} />;
      case 2:
        return <StepThree step={step} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <StepFour step={step} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <StepFive step={step} nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <StepSix step={step} prevStep={prevStep} />;
      default:
        return <StepTwo step={step} nextStep={nextStep} prevStep={prevStep} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stepIndicator}>
        {[1, 2, 3, 4, 5].map((s) => (
          <View
            key={s}
            style={[
              styles.stepDot,
              { backgroundColor: s <= step ? "#2B4B80" : "#D1D5DB" },
            ]}
          />
        ))}
      </View>
      {renderStep()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});

export default PropertyMultiStepForm;