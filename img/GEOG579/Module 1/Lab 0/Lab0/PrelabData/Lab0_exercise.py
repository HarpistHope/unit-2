# Import modules
import arcpy

# Set the workspace environment
arcpy.env.workspace = r"C:\Users\Hope McBride\OneDrive - UW-Madison\GEOG 579\Module 1\Lab 0\Lab0\PrelabData"

# Get a list of the feature classes in the current directory
datasets = arcpy.ListFeatureClasses()
print("Feature Classes in the current directory:")
for dataset in datasets:
    print(dataset)
print()

# Get a list of rasters in the current directory
rasterdatasets = arcpy.ListRasters()
print("Raster datasets in the current directory:")
for dataset in rasterdatasets:
    print(dataset)
print ()

# Combine feature classes/shapefiles and rasters into one group
dirDatasets = datasets + rasterdatasets
# check that the combination was successful
print(dirDatasets)
print()

# set up a for-loop + if-loop to identify and change any incorrect spatial reference to the correct WGS 1984 spatial reference
for dataset in dirDatasets:
    desdirDatasets = arcpy.Describe(dataset)
    # This if-loop will ensure the spatial references for all datasets are the same (WGS 1984). 
    # To identify only the spatial references labeled 'unknown', the code could say:   if desdirDatasets.spatialReference.name = "Unknown":
    if desdirDatasets.spatialReference.name != "GCS_WGS_1984":
       # Define projection 
        arcpy.management.DefineProjection(desdirDatasets, 4326)
    print("Spatial Reference: ", desdirDatasets.spatialReference.name)
print()





