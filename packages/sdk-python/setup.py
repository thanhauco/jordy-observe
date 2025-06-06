from setuptools import setup, find_packages

setup(
    name="jordy-observe",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "requests>=2.28.0",
        "pydantic>=2.0.0",
    ],
    author="Thanh Vu",
    description="Python SDK for Jordy Observe AI Observability",
)