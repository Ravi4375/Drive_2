package com.genie.Drive_BE.controller;

import com.genie.Drive_BE.entity.FileEntity;
import com.genie.Drive_BE.services.FileServiceStorage;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    private final FileServiceStorage fileServiceStorage;

    public FileController(FileServiceStorage fileServiceStorage) {
        this.fileServiceStorage = fileServiceStorage;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
                                             @RequestParam(value = "parentFolderId", required = false) Long parentFolderId) {
        try {
            String response = fileServiceStorage.saveFile(file, parentFolderId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("File upload failed!");
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        try {
            FileEntity fileEntity = fileServiceStorage.getFileById(id);
            Path path = Paths.get(fileEntity.getPath());
            Resource resource = new UrlResource(path.toUri());
            return ResponseEntity.ok()
                    .header("content-Disposition", "attachment; filename=\"" + fileEntity.getName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<FileEntity>> listfiles(@RequestParam(value = "parentFolderId", required = false) Long parentFolderId) {
        return ResponseEntity.ok(fileServiceStorage.getFilesInFolder(parentFolderId));
    }

    @GetMapping("/view/{section}")
    public ResponseEntity<List<FileEntity>> listBySection(@PathVariable String section) {
        return switch (section.toLowerCase()) {
            case "home", "my-drive", "computers" -> ResponseEntity.ok(fileServiceStorage.getFilesInFolder(null));
            case "shared" -> ResponseEntity.ok(fileServiceStorage.getSharedFiles());
            case "recent" -> ResponseEntity.ok(fileServiceStorage.getRecentFiles());
            case "starred" -> ResponseEntity.ok(fileServiceStorage.getStarredFiles());
            case "trash" -> ResponseEntity.ok(fileServiceStorage.getTrashFiles());
            default -> ResponseEntity.badRequest().build();
        };
    }

    @PatchMapping("/trash/{id}")
    public ResponseEntity<String> moveToTrash(@PathVariable Long id) {
        try {
            fileServiceStorage.moveToTrash(id);
            return ResponseEntity.ok("File moved to trash.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to move file to trash.");
        }
    }

    @PatchMapping("/restore/{id}")
    public ResponseEntity<String> restoreFromTrash(@PathVariable Long id) {
        try {
            fileServiceStorage.restoreFromTrash(id);
            return ResponseEntity.ok("File restored.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to restore file.");
        }
    }

    @PatchMapping("/star/{id}/toggle")
    public ResponseEntity<FileEntity> toggleStar(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(fileServiceStorage.toggleStar(id));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/storage")
    public ResponseEntity<Map<String, Object>> storageSummary() {
        return ResponseEntity.ok(fileServiceStorage.getStorageSummary());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable Long id) {
        try {
            FileEntity fileEntity = fileServiceStorage.getFileById(id);
            Path path = Paths.get(fileEntity.getPath());
            Files.deleteIfExists(path);
            fileServiceStorage.deleteById(id);
            return ResponseEntity.ok("File deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete file.");
        }
    }
}
