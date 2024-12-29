import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';

const colors = {
  primary: '#6B2FB3',
  primaryLight: '#F6F2F9',
  white: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
};

const questions = [
  {
    id: 'location',
    question: 'Which district do you live in?',
    type: 'text',
  },
  {
    id: 'occupation',
    question: 'What do you do?',
    type: 'text',
  },
  {
    id: 'interests',
    question: 'What are your interests?',
    type: 'multiSelect',
    options: ['Sports', 'Music', 'Movies', 'Food', 'Travel', 'Art', 'Technology', 'Reading'],
  },
  {
    id: 'sportsTeams',
    question: 'Which sports teams do you support?',
    type: 'text',
  },
  {
    id: 'meetPeople',
    question: 'What kind of people do you want to meet?',
    type: 'text',
  },
  {
    id: 'description',
    question: 'Describe yourself in a few words',
    type: 'text',
  },
];

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedInterests, setSelectedInterests] = useState([]);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save profile data and navigate to main app
      router.replace('/(tabs)');
    }
  };

  const handleInterestSelect = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];

    if (question.type === 'multiSelect') {
      return (
        <View style={styles.optionsContainer}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                selectedInterests.includes(option) && styles.selectedOption,
              ]}
              onPress={() => handleInterestSelect(option)}
            >
              <Text style={[
                styles.optionText,
                selectedInterests.includes(option) && styles.selectedOptionText,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <TextInput
        style={styles.input}
        placeholder="Type your answer"
        placeholderTextColor={colors.textSecondary}
        value={answers[question.id]}
        onChangeText={(text) => setAnswers({ ...answers, [question.id]: text })}
      />
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progress, 
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1}/{questions.length}
        </Text>
      </View>

      <Text style={styles.question}>{questions[currentQuestion].question}</Text>
      
      {renderQuestion()}

      <TouchableOpacity 
        style={styles.nextButton}
        onPress={handleNext}
        activeOpacity={0.9}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    padding: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: 2,
    marginRight: 12,
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.primary,
  },
  selectedOptionText: {
    color: colors.white,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
