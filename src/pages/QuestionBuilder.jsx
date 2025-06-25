import { useForm, useFieldArray, Controller } from "react-hook-form";
import { NeoBtn } from "../components/NeoBtn";

const QuestionBuilder = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: Date.now(),
      title: "",
      questions: [
        {
          text: "",
          options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
          correctOption: null,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
    rules: {
      required: "At least one question is required",
    },
  });

  const handleAddQuestion = () => {
    append({
      text: "",
      options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      correctOption: null,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6">
      <label className="block text-md font-bold mb-4">
        <input
          {...register("title", { required: "Quiz title is required" })}
          placeholder="Enter quiz title"
          className="w-full mt-2 px-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </label>

      <div className="flex flex-col mb-8 sm:flex-row justify-between gap-4">
        <NeoBtn
          type="button"
          className="bg-blue-200 text-sm"
          onClick={handleAddQuestion}
        >
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add new question
          </div>
        </NeoBtn>

        <NeoBtn type="submit" className="bg-green-400 text-sm">
          Save Quiz
        </NeoBtn>
      </div>

      <div className="space-y-6">
        {fields.map((question, questionIndex) => (
          <div
            key={question.id}
            className="bg-gray-100 rounded-xl p-6 border border-gray-900"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Question #{questionIndex + 1}
              </h3>
              <NeoBtn
                type="button"
                className="bg-red-400 text-sm p-0"
                onClick={() => remove(questionIndex)}
              >
                Delete
              </NeoBtn>
            </div>

            {/* Campo para la pregunta */}
            <div className="mb-6">
              <textarea
                {...register(`questions.${questionIndex}.text`, {
                  required: true,
                })}
                placeholder="What is the capital of France?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows="3"
              />
            </div>

            {/* Opciones de respuesta */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer Options:
              </label>

              {[0, 1, 2, 3].map((optionIndex) => (
                <div
                  key={optionIndex}
                  className="flex items-start space-x-3"
                  custom={optionIndex}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center h-10">
                    <Controller
                      control={control}
                      name={`questions.${questionIndex}.correctOption`}
                      render={({ field }) => (
                        <input
                          type="radio"
                          checked={field.value === optionIndex}
                          onChange={() => field.onChange(optionIndex)}
                          className="h-5 w-5 text-yellow-600 focus:ring-yellow-500"
                        />
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      {...register(
                        `questions.${questionIndex}.options.${optionIndex}.text`,
                        { required: true }
                      )}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="w-full text-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500 font-medium text-sm border-1">
                    {optionIndex + 1}
                  </span>
                </div>
              ))}

              <div className="mt-3 ml-8 text-sm text-gray-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Select the correct answer
              </div>
            </div>
          </div>
        ))}
      </div>

      {errors.questions?.root && (
        <p className="font-bold text-red-400 p-4 mt-4 bg-red-50 rounded-lg border border-red-200">
          {errors.questions?.root?.message}
        </p>
      )}
    </form>
  );
};

export default QuestionBuilder;
