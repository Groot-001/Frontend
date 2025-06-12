import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getUserProjects, updateProject } from '../../api/userApi';

const categoryOptions = [
    "Web Development", "Mobile App Development", "Data Science & Analytics",
    "Machine Learning", "Game Development", "UI/UX Design", "Cloud Computing",
    "Cybersecurity", "Blockchain", "DevOps & Automation", "Internet of Things (IoT)", "Other"
];

const EditProject = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        category: Yup.string().required('Category is required'),
        description: Yup.string().required('Description is required'),
        roles: Yup.array()
            .of(Yup.string().required('Role is required'))
            .min(1, 'At least one role is required')
            .required('Roles are required'),
    });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getUserProjects();
                const targetProject = data.projects.find(p => p._id === projectId);
                if (targetProject) {
                    setInitialValues({
                        title: targetProject.title,
                        category: targetProject.category,
                        description: targetProject.description,
                        roles: targetProject.roles,
                        roleInput: '',
                    });
                } else {
                    setErrorMsg('Project not found.');
                }
            } catch (error) {
                console.error('Error fetching project:', error);
                setErrorMsg('Failed to fetch project details.');
            }
        };

        fetchProject();
    }, [projectId]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const { ...projectData } = values;
            const response = await updateProject(projectId, projectData);
            setSuccessMsg(response.success || 'Project updated successfully!');
            setTimeout(() => {
                navigate('/main')
            }, 2000);
            resetForm();
        } catch (error) {
            setErrorMsg(error.response?.data?.error || 'Failed to update project');
        } finally {
            setSubmitting(false);
        }
    };

    if (!initialValues) {
        return <div className="p-6 text-center text-blue-700">Loading project...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="relative bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full animate-fadeIn">
                {/* Cross Close Button */}
                <button
                    onClick={() => navigate('/main')}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-wide font-sans drop-shadow-md">
                    Edit Project
                </h2>

                {successMsg && (
                    <p className="text-green-700 bg-green-100 px-5 py-3 mb-6 rounded-lg text-center font-semibold shadow-sm">
                        {successMsg}
                    </p>
                )}
                {errorMsg && (
                    <p className="text-red-700 bg-red-100 px-5 py-3 mb-6 rounded-lg text-center font-semibold shadow-sm">
                        {errorMsg}
                    </p>
                )}

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form className="space-y-6">
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-gray-700 font-semibold mb-1 select-none"
                                >
                                    Category
                                </label>
                                <Field
                                    as="select"
                                    name="category"
                                    id="category"
                                    className="mt-1 w-full px-5 py-3 border border-gray-300 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                             shadow-sm transition duration-300"
                                    onChange={(e) => {
                                        setFieldValue('category', e.target.value);
                                    }}
                                >
                                    <option value="" disabled>
                                        Select category
                                    </option>
                                    {categoryOptions.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="category"
                                    component="p"
                                    className="text-red-500 text-sm mt-1 font-medium"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-gray-700 font-semibold mb-1 select-none"
                                >
                                    Title
                                </label>
                                <Field
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter project title"
                                    className="mt-1 w-full px-5 py-3 border border-gray-300 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                             shadow-sm transition duration-300"
                                />
                                <ErrorMessage
                                    name="title"
                                    component="p"
                                    className="text-red-500 text-sm mt-1 font-medium"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-gray-700 font-semibold mb-1 select-none"
                                >
                                    Description
                                </label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    id="description"
                                    rows="4"
                                    placeholder="Write a brief about your project..."
                                    className="mt-1 w-full px-5 py-3 border border-gray-300 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                             shadow-sm transition duration-300 resize-none"
                                />
                                <ErrorMessage
                                    name="description"
                                    component="p"
                                    className="text-red-500 text-sm mt-1 font-medium"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="roles"
                                    className="block text-gray-700 font-semibold mb-1 select-none"
                                >
                                    Required Roles
                                </label>

                                <div className="flex items-center gap-2 mb-2">
                                    <Field name="roleInput">
                                        {({ field, form }) => (
                                            <>
                                                <input
                                                    type="text"
                                                    {...field}
                                                    placeholder="Enter a role and press Add"
                                                    className="flex-grow px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const trimmed = field.value.trim();
                                                            if (trimmed && !form.values.roles.includes(trimmed)) {
                                                                form.setFieldValue('roles', [...form.values.roles, trimmed]);
                                                                form.setFieldValue('roleInput', '');
                                                            }
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg font-semibold transition"
                                                    onClick={() => {
                                                        const trimmed = field.value.trim();
                                                        if (trimmed && !form.values.roles.includes(trimmed)) {
                                                            form.setFieldValue('roles', [...form.values.roles, trimmed]);
                                                            form.setFieldValue('roleInput', '');
                                                        }
                                                    }}
                                                >
                                                    Add
                                                </button>
                                            </>
                                        )}
                                    </Field>
                                </div>

                                <Field name="roles">
                                    {({ form }) => (
                                        <div className="flex flex-wrap gap-2">
                                            {form.values.roles.map((role, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2"
                                                >
                                                    {role}
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                                                        onClick={() => {
                                                            const updated = [...form.values.roles];
                                                            updated.splice(index, 1);
                                                            form.setFieldValue('roles', updated);
                                                        }}
                                                        aria-label={`Remove role ${role}`}
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </Field>

                                <ErrorMessage
                                    name="roles"
                                    component="p"
                                    className="text-red-500 text-sm mt-1 font-medium"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl
                           hover:bg-blue-700 transform hover:scale-105 transition duration-300
                           font-semibold shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Project'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EditProject;
